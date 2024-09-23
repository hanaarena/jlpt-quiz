import { useAtomValue } from "jotai";
import { questionTypeAtom } from "../atoms";
import { useEffect, useMemo, useState } from "react";
import { randomAllMoji } from "@/app/data";
import { ChatTypeValue } from "@/app/utils/const";
import { generateGemini } from "@/app/actions/gemeni";
import { toast } from "@/components/ui/use-toast";
import { handleBunpooOutput } from "@/app/actions/quizGenerationParse";
import Loading from "../loading";
import RandomButton from "../randomButton";
import { convertJpnToKana } from "@/app/utils/jpn";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import { cheerful } from "@/app/utils/fns";
import AnswerButton from "./AnswerButton";

export default function Bunpoo() {
  const questionType = useAtomValue(questionTypeAtom);
  const [isLoading, setLoading] = useState(false);
  const [generation, setGeneration] = useState<IDooshiGenerationResult>();
  const [keyword, setKeyword] = useState<{
    kana: string;
    kanji: string;
    type: string;
    meaning: string;
  }>();
  const [showAnswer, setShowAnswer] = useState(false);
  const [kanaObj, setKanaObj] = useState({
    title: "",
    keyword: "",
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);

  const generate = async () => {
    setLoading(true);
    setShowAnswer(false);
    setSelectedAnswer([]);
    const randomMoji = randomAllMoji();
    const { kana, kanji } = randomMoji;
    const content = `关键词：${kanji ? `${kanji}(${kana})` : kana}`;
    setKeyword(randomMoji);
    generateGemini({ content, chatType: ChatTypeValue.N2Bunpoo }).then(
      async (result) => {
        const res = { ...result };
        if (res instanceof Error) {
          toast({
            title: "Gemini failed",
            description: res.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (res.text) {
          res.text = res.text.replace(/\n/g, "  \n");
          const result = await handleBunpooOutput(res.text);
          // if (!result.questionTitle) {
          //   generate();
          // }
          console.warn("bunpoo page result", result);
          setGeneration(result);
          setLoading(false);
        }
      }
    );
  };

  const handleSubmit = () => {
    if (selectedAnswer.length === 0) {
      toast({
        variant: "destructive",
        title: "请选择答案",
        duration: 2000,
      });
      return;
    }
    if (generation?.questionAnswerArr?.join("-") === selectedAnswer.join("-")) {
      cheerful();
    } else {
      toast({
        variant: "destructive",
        title: "残念です！",
        duration: 2000,
      });
    }
    setShowAnswer(true);
  };

  useMemo(() => {
    if (questionType === 2) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType]);

  useEffect(() => {
    const fetchData = async () => {
      if (keyword && Object.keys(keyword).length) {
        let _k = "";
        if (keyword.kana && !keyword.kanji) {
          _k = keyword.kana;
        } else {
          _k = await convertJpnToKana(keyword?.kanji);
        }
        setKanaObj({
          title: "",
          keyword: _k,
        });
      }
    };
    fetchData();
  }, [keyword]);

  return (
    <div className="question-buubo flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        generation &&
        Object.keys(generation).length && (
          <>
            <div className="answer">
              <h3 className="question-keyword mb-4 text-blue-600 font-bold">
                关键词:
                {kanaObj?.keyword && (
                  <span
                    className="blur-sm hover:blur-0"
                    dangerouslySetInnerHTML={{
                      __html: kanaObj?.keyword,
                    }}
                  />
                )}
              </h3>
              <h3 className="mb-4 font-bold">
                Q:
                <span
                  dangerouslySetInnerHTML={{
                    __html: generation.questionTitle,
                  }}
                />
              </h3>
              <h3 className="mb-4">
                当前选择答案顺序: {selectedAnswer.join("-")}
                <Button className="ml-4" size={"sm"} onClick={handleSubmit}>
                  提交
                </Button>
              </h3>

              <h3 className="mb-4">
                <div className="flex max-sm:flex-col flex-wrap items-center">
                  {generation?.questionOptions.map((q, index) => (
                    <AnswerButton
                      key={`${index}-${q}`}
                      variant={"ghost"}
                      className={cn(
                        "max-sm:mb-2 select-none",
                        selectedAnswer.findIndex((v) => v === index + 1) > -1
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      )}
                      onClick={() => {
                        const arr = [...selectedAnswer];
                        const prevIndex = arr.findIndex((v) => v === index + 1);
                        if (prevIndex > -1) {
                          arr.splice(prevIndex, 1);
                        } else {
                          arr.push(index + 1);
                        }
                        setSelectedAnswer(arr);
                      }}
                    >
                      <Markdown>{`**${index + 1}.** ${q}`}</Markdown>
                    </AnswerButton>
                  ))}
                </div>
              </h3>
              {showAnswer && (
                <>
                  <h3>答案: </h3>
                  <Markdown>{generation.questionExplanation}</Markdown>
                </>
              )}
            </div>
            <RandomButton text="再来一题" onClick={generate} className="mt-4" />
          </>
        )
      )}
    </div>
  );
}
