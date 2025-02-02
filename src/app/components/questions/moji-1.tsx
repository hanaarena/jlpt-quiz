import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { questionTypeAtom } from "../atoms";
import { randomAllMoji } from "@/data";
import { generateGemini } from "@/app/actions/gemini";
import { ChatTypeValue } from "@/app/utils/const";
import { handleKanjiOutput } from "@/app/actions/quizGenerationParse";
import Loading from "../loading";
import Markdown from "react-markdown";
import RandomButton from "../randomButton";
import { cheerful } from "@/app/utils/fns";
import CorrectIcon from "../icons/correct";
import WrongIcon from "../icons/wrong";
import { Button, cn } from "@heroui/react";

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

  const generate = async () => {
    setLoading(true);
    setShowAnswer(false);
    setSelectedAnswer("");
    const randomMoji = randomAllMoji();
    const { kana, kanji } = randomMoji;
    const content = kanji ? kanji : kana;
    setKeyword(randomMoji);
    await generateGemini({ content, chatType: ChatTypeValue.N2Moji1 }).then(
      async (result) => {
        const res = { ...result };
        if (res instanceof Error) {
          setLoading(false);
          return;
        }

        if (res.text) {
          res.text = res.text.replace(/\n/g, "  \n");
          const result = await handleKanjiOutput(
            res.text,
            {
              kana: randomMoji.kana || "",
              kanji: randomMoji.kanji || "",
            },
            ChatTypeValue.N2Moji1
          );
          // unexpected result content,re-fetch
          if (!result.questionTitle) {
            await generate();
          }
          setGeneration(result);
        }
        setLoading(false);
      }
    );
  };

  const handleSubmit = (ans: string) => {
    setSelectedAnswer(ans);
    setShowAnswer(true);

    if (ans === generation?.questionAnswer) {
      cheerful();
    }
  };

  useMemo(() => {
    if (questionType === 3) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType]);

  return (
    <div className="moji-1 flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        generation &&
        Object.keys(generation).length && (
          <>
            <div className="answer">
              {keyword?.kanji && (
                <h3 className="question-keyword mb-4 text-blue-600 font-bold">
                  关键词:
                  <span className="blur-sm hover:blur-0">{`${keyword?.kanji}`}</span>
                </h3>
              )}
              <h3 className="mb-4 font-bold">
                Q:
                <span
                  dangerouslySetInnerHTML={{
                    __html: generation.questionTitle,
                  }}
                />
              </h3>
              <h3 className="mb-4">
                <div className="flex max-sm:flex-col flex-wrap items-center">
                  {generation?.questionOptions.map((q, index) => (
                    <Button
                      key={`${index}-${q}`}
                      className={cn(
                        "question-options w-full mb-3 border-black",
                        "relative inline-flex h-[38px] items-center justify-center rounded-[6px] border leading-none",
                        selectedAnswer === q
                          ? "bg-black text-white"
                          : "bg-white text-black",
                        "max-sm:mb-2 min-w-[80px]"
                      )}
                      onPress={() => {
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
            <RandomButton text="再来一题" onClick={generate} className="mt-4" />
          </>
        )
      )}
    </div>
  );
}
