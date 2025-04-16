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

interface IQuiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuickQuizTest({ quizName }: { quizName: string }) {
  const questionCount = 10;
  const [quiz, setQuiz] = useState<IQuiz[]>([]);
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [wrongQues, setWrongQues] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  const getQuestions = useCallback(async () => {
    const kanjiList = getRandomKanjiV2(EJLPTLevel.N2, questionCount, true);
    const str = kanjiList.map((k) => k.kanji).join(",");
    setLoading(true);
    await post<{
      data: { generatedText: string; name: string; quizName: string };
    }>("/api/quiz/gemini/questions", {
      content: str,
      name: quizName,
    })
      .then((r) => {
        const { generatedText } = r.data || {};
        const o = generatedText.split("<hr>");
        const resultArr: IQuiz[] = [];
        const regex = /\<mm\>([\s\S]*?)\<\/mm\>/gm;
        o.forEach((item) => {
          // array format: [question, options, answer, explanation]
          const arr = [];
          let m;
          while ((m = regex.exec(item)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            arr.push(m[1]);
          }
          if (arr.length) {
            const [opts, ans] = shuffleOptions(arr[1], arr[2]);
            resultArr.push({
              question: arr[0],
              options: opts,
              answer: ans,
              explanation: arr[3],
            });
          }
        });
        setQuiz(resultArr);
        setCurrentIndex(0);
        setLoading(false);
      })
      .catch((e) => {
        toast.error("Gemini failed: " + e);
      })
      .finally(() => {
        setLoading(false);
      });
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
    if (currentIndex <= questionCount - 1) {
      setAnswer("");
      setCurrentIndex((p) => p + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(-1);
    setAnswer("");
    setWrongQues([]);
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
        <div className="w-4/5 mt-6 flex flex-col md:items-center">
          {loading && <LoadingV4Gemini />}
          {currentIndex > -1 && currentIndex <= questionCount - 1 && (
            <>
              <div className="progress mb-10">
                {currentIndex + 1} / {questionCount}
              </div>
              {quiz[currentIndex] && (
                <>
                  <div
                    className={cn("question mb-10", "question-text")}
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
                          "active:border-none min-w-[16rem]",
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
                        {o}
                      </Button>
                    ))}
                  </div>
                  <div className="actions flex items-center justify-center">
                    {answer && (
                      <QuizAnswerModal className="mr-4">
                        <p className="text-lg font-bold">Explanation</p>
                        <div
                          className="mb-4"
                          dangerouslySetInnerHTML={{
                            __html: quiz[currentIndex].explanation.replaceAll(
                              "\n",
                              "<br>"
                            ),
                          }}
                        />
                      </QuizAnswerModal>
                    )}
                    <Button
                      className="bg-[var(--quick-quiz-bg-color)]"
                      onPress={handleNext}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
          {currentIndex > questionCount - 1 && (
            <div className="final w-full">
              <p className="text-4xl font-bold text-center">Score</p>
              <p className="mb-10 text-center border max-w-fit block mx-auto px-2">
                {(Math.floor(questionCount - wrongQues.length) /
                  questionCount) *
                  100}
                %
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
                        __html: w.explanation.replaceAll("\n", "<br>"),
                      }}
                    />
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
