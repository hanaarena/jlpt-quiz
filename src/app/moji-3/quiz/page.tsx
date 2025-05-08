"use client";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectorLevel } from "../moji3Slice";
import Moji1Header from "../header";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { ChatTypeValue } from "@/app/utils/const";
import { Button, cn } from "@heroui/react";
import { cheerful } from "@/app/utils/fns";
import { RotateCw, ArrowLeft, ArrowRight } from "lucide-react";
import BackHomeLink from "@/app/components/backHomeLink";
import { changeThemeColor } from "@/app/utils/meta";
import { shuffleOptions } from "@/app/utils/quiz";
import BackgroundImage from "@/app/components/BackgroundImage";
import QuizAnsewerModal from "@/app/components/quizAnsewerModal";
import {
  addQuizToHistory,
  goToPreviousQuiz,
  goToNextQuiz,
  updateCurrentAnswer,
  selectCurrentQuiz,
  selectCurrentIndex,
  selectQuizHistory,
  resetQuizHistory,
} from "@/app/store/quizHistorySlice";
import { post } from "@/app/utils/request";

export default function Moji3QuizPage() {
  const level = useAppSelector(selectorLevel);
  const dispatch = useAppDispatch();
  const currentQuiz = useAppSelector(selectCurrentQuiz<IMoji3Quiz>);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const quizHistory = useAppSelector(selectQuizHistory);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({ options: [] } as unknown as IMoji3Quiz);
  const [answer, setAnswer] = useState("");

  async function wrapMutation() {
    return post<{
      data: { generatedText: string; name: string; quizName: string };
    }>("/api/quiz/gemini/questions", {
      content: "hoolala",
      name: ChatTypeValue.Moji3,
    });
  }

  const { mutate } = useMutation({
    mutationFn: wrapMutation,
    onMutate: () => {
      setAnswer("");
      setLoading(true);
    },
    onSuccess: (res) => {
      // `o` is quiz array:
      // [`question`, `options`, `answer`, `translation`, `options explanation]
      const { generatedText } = res.data || {};
      const o = generatedText.split("[sperator]");
      const resultArr: string[] = [];
      const regex = /\<mm\>([\s\S]*?)\<\/mm\>/gm;
      o.forEach((item) => {
        let m;
        while ((m = regex.exec(item)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          resultArr.push(m[1]);
        }
      });
      const [question, options, answer, translation, explanation] = resultArr;
      const [opts, ans] = shuffleOptions(options, answer);
      const newQuiz = {
        question,
        options: opts,
        answer: ans,
        explanation: explanation?.replaceAll("\n", "<br />"),
        translation,
      };
      setQuiz(newQuiz);
      dispatch(addQuizToHistory({ quiz: newQuiz, answer: "" }));
      setLoading(false);
    },
    onError: (err) => {
      toast.error("Gemini failed: " + err, { duration: 2000 });
    },
    retryDelay: 1000,
    retry: 2,
  });

  function handleNext() {
    if (currentIndex < quizHistory.length - 1) {
      dispatch(goToNextQuiz());
    } else {
      mutate();
    }
  }

  function handlePrevious() {
    dispatch(goToPreviousQuiz());
  }

  const handleAnswerSelect = (selectedAnswer: string) => {
    setAnswer(selectedAnswer);
    dispatch(updateCurrentAnswer(selectedAnswer));
    if (selectedAnswer === quiz.answer) {
      cheerful();
    } else {
      toast.error("Wrong!", { duration: 2000 });
    }
  };

  useEffect(() => {
    if (!level.size) {
      redirect("/moji-3");
    }
    dispatch(resetQuizHistory());
    handleNext();
    document.title = "文字(単語) - Exceed JLPT";
    changeThemeColor("#008080");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentQuiz) {
      setQuiz(currentQuiz.quiz);
      setAnswer(currentQuiz.answer);
    }
  }, [currentQuiz]);

  return (
    <div>
      <BackgroundImage src="/bg-6.jpeg" className="bg-opacity-85" />
      <Toaster />
      <div className="relative md:max-w-3xl md:mx-auto">
        <BackHomeLink className="-mt-1" />
        <Moji1Header />
        <main className="mt-14 px-6 max-w-3xl mx-auto md:-mt-6">
          {loading ? (
            <LoadingV4Gemini />
          ) : (
            <>
              <div
                className="text-3xl mb-10 text-center"
                dangerouslySetInnerHTML={{
                  __html: quiz.question,
                }}
              ></div>
              <div className="options flex flex-col gap-5 justify-center items-center min-w-full">
                {quiz.options.map(
                  (item, index) =>
                    item && (
                      <Button
                        key={index}
                        color="primary"
                        variant="ghost"
                        className={cn(
                          "data-[hover=true]:!bg-[#008080]",
                          "w-9/12 border-black text-black",
                          "active:border-none text-lg",
                          answer && item === quiz.answer
                            ? "bg-green-500 border-green-500"
                            : answer === item &&
                                answer !== quiz.answer &&
                                "bg-red-500 border-red-500"
                        )}
                        onPress={() => {
                          handleAnswerSelect(item);
                        }}
                      >
                        {item}
                      </Button>
                    )
                )}
              </div>
              {answer && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <QuizAnsewerModal>
                    <p className="text-lg font-bold">Translation</p>
                    <div
                      className="mb-4 font-sans"
                      dangerouslySetInnerHTML={{
                        __html: quiz.translation,
                      }}
                    />
                    <p className="text-lg font-bold">Explanation</p>
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{
                        __html: quiz.explanation,
                      }}
                    />
                  </QuizAnsewerModal>
                  {currentIndex > 0 && (
                    <Button
                      isIconOnly
                      aria-label="Previous"
                      color="primary"
                      variant="bordered"
                      className="border-[--moji3-text-color] "
                      onPress={handlePrevious}
                    >
                      <ArrowLeft color="#008080" />
                    </Button>
                  )}
                  {currentIndex < quizHistory.length - 1 && (
                    <Button
                      isIconOnly
                      aria-label="Next"
                      color="primary"
                      variant="bordered"
                      className="border-[--moji3-text-color] "
                      onPress={handleNext}
                    >
                      <ArrowRight color="#008080" />
                    </Button>
                  )}
                  <Button
                    isIconOnly
                    aria-label="Next"
                    color="primary"
                    variant="bordered"
                    className="border-[--moji3-text-color] "
                    onPress={handleNext}
                  >
                    <RotateCw color="#008080" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
