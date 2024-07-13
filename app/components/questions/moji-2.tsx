import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { questionTypeAtom } from "../atoms";
import { randomAllMoji } from "@/app/data";
import { generateGemini } from "@/app/actions/gemeni";
import { toast } from "@/components/ui/use-toast";
import { ChatTypeValue } from "@/app/utils/const";
import { handleKanjiOutput } from "@/app/actions/quizGenerationParse";
import Loading from "../loading";
import Markdown from "react-markdown";
import RandomButton from "../randomButton";
import { Button } from "@/components/ui/button";
import { cheerful } from "@/app/utils/fns";
import CorrectIcon from "../icons/correct";
import WrongIcon from "../icons/wrong";
import { cn } from "@/lib/utils";
import { convertJpnToKana } from "@/app/utils/jpn";

export default function Moji1() {
  const questionType = useAtomValue(questionTypeAtom);
  const [isLoading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<{
    kana: string;
    kanji: string;
    type: string;
    meaning: string;
  }>();
  const [generation, setGeneration] = useState<IDooshiGenerationResult>();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [kanaObj, setKanaObj] = useState({
    title: "",
    keyword: "",
  });

  const generate = async () => {
    const randomMoji = randomAllMoji();
    const { kana, kanji } = randomMoji;
    const content = kanji ? kanji : kana;
    setKeyword(randomMoji);
    setLoading(true);
    setShowAnswer(false);
    generateGemini({ content, chatType: ChatTypeValue.N2Moji2 }).then(
      async (result) => {
        const res = { ...result };
        if (res instanceof Error) {
          toast({
            title: "Gemini failed",
            description: res.message,
            variant: "destructive",
          });
          return;
        }

        if (res.text) {
          res.text = res.text.replace(/\n/g, "  \n");
          console.warn("kekek res.text", res.text);
          const result = await handleKanjiOutput(
            res.text,
            {
              kana: randomMoji.kana || "",
              kanji: randomMoji.kanji || "",
            },
            ChatTypeValue.N2Moji2
          );
          // unexpected result content,re-fetch
          if (!result.questionTitle) {
            generate();
          }
          console.warn("kekek result", result);
          setGeneration(result);
          setLoading(false);
        }
      }
    );
  };

  const replay = () => {
    setLoading(true);
    setShowAnswer(false);
    generate();
  };

  const handleSubmit = (ans: string) => {
    setShowAnswer(true);

    if (ans === generation?.questionAnswer) {
      cheerful();
    } else {
      toast({
        variant: "destructive",
        title: "残念です！",
        duration: 2000,
      });
    }
  };

  useMemo(() => {
    if (questionType === 4) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType]);

  useEffect(() => {
    const data = async () => {
      if (keyword && Object.keys(keyword)) {
        console.warn("kekek keyword", keyword);
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
    data();
  }, [keyword]);

  return (
    <div className="moji-1 flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        generation &&
        Object.keys(generation).length && (
          <>
            <div className="answer">
              <h3 className="mb-4 font-bold">
                关键词:
                {kanaObj?.keyword && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: kanaObj?.keyword,
                    }}
                  />
                )}
              </h3>
              <h3 className="mb-4">
                <b>题目: </b>
                <span
                  dangerouslySetInnerHTML={{
                    __html: generation.questionTitle,
                  }}
                />
              </h3>
              <h3 className="mb-4">
                <b>选项:</b>
                <div className="flex max-sm:flex-col flex-wrap items-center">
                  {generation?.questionOptions.map((q, index) => (
                    <Button
                      key={`${index}-${q}`}
                      className={cn(
                        "relative hover:bg-black hover:text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] border font-medium leading-none focus:outline-none mr-2",
                        selectedAnswer === q
                          ? "bg-black text-white"
                          : "bg-white text-black",
                        "max-sm:mb-2 min-w-[80px]"
                      )}
                      onClick={() => {
                        setSelectedAnswer(q);
                        handleSubmit(q);
                      }}
                    >
                      <Markdown>{q}</Markdown>
                      <div className="absolute w-6 left-1">
                        {generation.questionAnswer === q && showAnswer && (
                          <CorrectIcon />
                        )}
                        {generation.questionAnswer !== q && showAnswer && (
                          <WrongIcon />
                        )}
                      </div>
                    </Button>
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
            <RandomButton text="再来一题" onClick={replay} className="mt-4" />
          </>
        )
      )}
    </div>
  );
}
