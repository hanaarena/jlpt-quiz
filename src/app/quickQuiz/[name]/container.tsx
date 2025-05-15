"use client";

import QuizAnswerModal from "@/app/components/quizAnsewerModal";
import { EJLPTLevel } from "@/app/types";
import { post } from "@/app/utils/request";
import { getRandomKanjiV2 } from "@/data/kanjiV2";
import { Button, cn } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";
import QuickQuizHeader from "./header";
import BackHomeLink from "@/app/components/backHomeLink";
import BackgroundImage from "@/app/components/BackgroundImage";
import { cheerful } from "@/app/utils/fns";
import { shuffleOptions } from "@/app/utils/quiz";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Timer from "./timer";

interface IQuiz {
  question: string;
  options: string[];
  answer: string;
  translation: string;
  explanation?: string;
}

export default function QuickQuizTest({ quizName }: { quizName: string }) {
  const [questionCount, setCount] = useState(10);
  const [quiz, setQuiz] = useState<IQuiz[]>([]);
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [wrongQues, setWrongQues] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const query = useSearchParams();

  const getQuestions = useCallback(async () => {
    const l = `${query.get("level")}`?.toUpperCase() as keyof typeof EJLPTLevel;
    const kanjiList = getRandomKanjiV2(EJLPTLevel[l], questionCount, true);
    const str = kanjiList.map((k) => k.kanji).join(",");
    setLoading(true);

    await post<{
      data: { generatedText: string; name: string; quizName: string };
    }>("/api/quiz/gemini/questions", {
      content: str,
      name: quizName,
      cache: true,
    })
      .then((r) => {
        const { generatedText } = r.data || {};
        const o = generatedText.split("[sperator]");
        const resultArr: IQuiz[] = [];
        const regex = /\<mm\>([\s\S]*?)\<\/mm\>/gm;
        o.forEach((item) => {
          // array format: [question, options, answer, translation, [explanation]]
          const arr = [];
          let m;
          while ((m = regex.exec(item)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            arr.push(m[1]);
          }
          if (arr.length) {
            const [opts, ans] = shuffleOptions(arr[1], arr[2], false);
            resultArr.push({
              question: arr[0].replace(/\?\n/g, "<br/>"),
              options: opts,
              answer: ans,
              translation: arr[3],
              explanation: arr[4] ? arr[4] : "",
            });
          }
        });
        setCurrentIndex(0);
        setCount(resultArr.length);
        setQuiz(resultArr);
        setLoading(false);
        setStartTime(Date.now());
      })
      .catch((e) => {
        toast.error("Gemini failed: " + e);
        setFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizName]);

  const detection = (selected: string) => {
    if (answer) return;

    const q = quiz[currentIndex];
    setAnswer(selected);

    if (selected !== q.answer) {
      setWrongQues((old) => [...old, q]);
    } else {
      cheerful();
    }
  };

  const handleNext = () => {
    if (questionCount === 1) {
      handleReset();
    } else if (currentIndex <= questionCount - 1) {
      setAnswer("");
      setCurrentIndex((p) => p + 1);
    }
  };

  const handleReset = () => {
    setFailed(false);
    setCurrentIndex(-1);
    setAnswer("");
    setWrongQues([]);
    setCount(0);
    getQuestions();
  };

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  return (
    <div className="md:mx-auto">
      <Toaster />
      <BackgroundImage src="/bg-8.jpg" className="bg-opacity-85" />
      <div className="relative w-full flex items-center flex-col">
        <BackHomeLink />
        <QuickQuizHeader />
        {loading && <LoadingV4Gemini className="w-10/12 md:w-1/2 mt-20" />}
        <div className="w-4/5 mt-6 flex flex-col md:items-center md:-mt-24">
          {failed && (
            <p
              className="mt-10 text-center text-xl text-center text-red-500 cursor-pointer"
              onClick={handleReset}
            >
              Generated content failed. Click to refresh
            </p>
          )}
          {currentIndex > -1 && currentIndex <= questionCount - 1 && (
            <>
              <div className="progress mb-10 text-3xl flex justify-between items-center md:flex-col">
                <p className="font-bold">
                  {currentIndex + 1} / {questionCount}
                </p>
                <Timer
                  startTime={startTime}
                  isRunning={currentIndex <= questionCount - 1}
                  className="text-lg"
                />
              </div>
              {quiz[currentIndex] && (
                <>
                  <div
                    className={cn("question mb-10", "question-text text-xl font-serif font-bold")}
                    dangerouslySetInnerHTML={{
                      __html: quiz[currentIndex].question,
                    }}
                  />
                  <div className="options flex items-center flex-col mb-6 gap-4">
                    {quiz[currentIndex].options.map((o) => (
                      <Button
                        key={o}
                        color="primary"
                        variant="ghost"
                        className={cn(
                          "active:border-none min-w-[16rem] max-w-[70%] break-words whitespace-normal py-1 box-content",
                          "text-[color:#222] border-[--quick-quiz-bg-color]",
                          "data-[hover=true]:!bg-[--quick-quiz-bg-color]",
                          "data-[hover=true]:!border-[--quick-quiz-bg-color]",
                          answer && o === quiz[currentIndex].answer
                            ? "bg-green-500 border-green-500"
                            : answer === o &&
                                answer !== quiz[currentIndex].answer &&
                                "bg-red-500 border-red-500"
                        )}
                        onPress={() => detection(o)}
                      >
                        <p
                          dangerouslySetInnerHTML={{
                            __html: o.replaceAll("\n", ""),
                          }}
                        />
                      </Button>
                    ))}
                  </div>
                  <div className="actions flex flex-col justify-center items-center">
                    {answer && (
                      <>
                        <Button
                          className="bg-[var(--quick-quiz-bg-color)] mb-2"
                          onPress={handleNext}
                        >
                          Next
                        </Button>
                        <QuizAnswerModal
                          className="mb-10"
                        >
                          <p className="text-lg font-bold">Explanation</p>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: quiz[currentIndex].translation.replace(
                                /\\?\\n/g,
                                "<br>"
                              ),
                            }}
                          />
                          {quiz[currentIndex].explanation && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: quiz[
                                  currentIndex
                                ].explanation.replaceAll("\n", "<br>"),
                              }}
                            />
                          )}
                        </QuizAnswerModal>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {currentIndex > questionCount - 1 && (
            <div className="final w-full">
              <p className="text-4xl font-bold text-center">Score</p>
              <p className="mb-4 text-center border max-w-fit block mx-auto px-2 underline decoration-4 decoration-orange-400 underline-offset-2">
                {(Math.floor(questionCount - wrongQues.length) /
                  questionCount) *
                  100}
                %
              </p>
              <p className="mb-10 text-center font-mono">
                Time costed: <Timer startTime={startTime} isRunning={false} />
              </p>
              <p className="text-lg underline">Wrong list</p>
              <Accordion variant="light">
                {wrongQues.map((w) => (
                  <AccordionItem
                    key={w.answer}
                    title={
                      <p
                        dangerouslySetInnerHTML={{ __html: w.question }}
                        className="question-text"
                      ></p>
                    }
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: w.translation.replaceAll("\n", "<br>"),
                      }}
                    />
                    {w.explanation && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: w.explanation.replaceAll("\n", "<br>"),
                        }}
                      />
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
              <Button
                className="bg-[var(--quick-quiz-bg-color)] block mx-auto my-4"
                onPress={handleReset}
              >
                Restart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
