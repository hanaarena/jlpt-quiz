"use client";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectorLevel } from "../moji1Slice";
import Moji1Header from "../header";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";
import { generateGemini } from "@/app/actions/gemini";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { ChatTypeValue } from "@/app/utils/const";
import { getRandomKanjiV2, type KanjiV2 } from "@/data/kanjiV2";
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

export default function Moji1QuizPage() {
  const level = useAppSelector(selectorLevel);
  const dispatch = useAppDispatch();
  const currentQuiz = useAppSelector(selectCurrentQuiz<IMoji1Quiz>);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const quizHistory = useAppSelector(selectQuizHistory);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({ options: [] } as unknown as IMoji1Quiz);
  const [answer, setAnswer] = useState("");

  async function wrapMutation(quiz: KanjiV2) {
    return generateGemini({
      content: quiz.kanji || quiz.kana,
      chatType: ChatTypeValue.N2Moji1,
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
      // [`keyword`, `question`, `options`, `answer`, `furigana maker`, `translation`]
      const o = res.text.split("[sperator]");
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
      const [keyword, question, options, answer, furigana, translation] =
        resultArr;
      const [opts, ans] = shuffleOptions(options, answer);
      let _furigana = furigana;
      // pick kanji keyword from question then highlight it in answer text
      // (if include both kanji and furigana will skip this part)
      const pickKeyword = question.match(/<u>([\s\S]*?)<\/u>/);
      if (pickKeyword && pickKeyword[1]) {
        _furigana = _furigana.replace(
          new RegExp(pickKeyword[1]),
          `<span class="bg-yellow-400/80">${pickKeyword[1]}</span>`
        );
      }
      const newQuiz = {
        keyword,
        question: question.replace(/\([^)]*\)/g, ""),
        options: opts,
        answer: ans,
        furigana: _furigana,
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
    if (currentIndex > -1 && currentIndex < quizHistory.length - 1) {
      dispatch(goToNextQuiz());
    } else {
      const _quiz = getRandomKanjiV2([...level][0], 1, true);
      if (_quiz.length) {
        mutate(_quiz[0]);
      }
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
      redirect("/moji-1");
    }
    dispatch(resetQuizHistory());
    handleNext();
    document.title = "文字① - Exceed JLPT";
    changeThemeColor("#FFAA33");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentQuiz) {
      setQuiz(currentQuiz.quiz);
      setAnswer(currentQuiz.answer);
    }
  }, [currentQuiz]);

  return (
    <div className="md:mx-auto">
      <BackgroundImage src="/bg-5.jpeg" className="bg-opacity-90" />
      <Toaster />
      <div className="relative">
        <BackHomeLink className="-mt-3" />
        <Moji1Header />
        <main className="mt-14 px-6 mx-auto md:max-w-3xl">
          {loading ? (
            <LoadingV4Gemini />
          ) : (
            <>
              <div
                className="text-3xl mb-10 text-center question-text"
                dangerouslySetInnerHTML={{
                  __html: answer ? quiz.furigana : quiz.question,
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
                          "data-[hover=true]:!bg-[#f4ad4e]",
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
                    <p
                      className="text-xl"
                      dangerouslySetInnerHTML={{ __html: quiz.furigana }}
                    ></p>
                    <div
                      className="mb-4 font-sans"
                      dangerouslySetInnerHTML={{
                        __html: quiz.translation,
                      }}
                    />
                  </QuizAnsewerModal>
                  {currentIndex > 0 && (
                    <Button
                      isIconOnly
                      aria-label="Previous"
                      color="primary"
                      variant="bordered"
                      className="border-[--moji-text-color] "
                      onPress={handlePrevious}
                    >
                      <ArrowLeft color="#020a5a" />
                    </Button>
                  )}
                  {currentIndex > -1 &&
                    currentIndex < quizHistory.length - 1 && (
                      <Button
                        isIconOnly
                        aria-label="Next"
                        color="primary"
                        variant="bordered"
                        className="border-[--moji-text-color] "
                        onPress={handleNext}
                      >
                        <ArrowRight color="#020a5a" />
                      </Button>
                    )}
                  <Button
                    isIconOnly
                    aria-label="Next"
                    color="primary"
                    variant="bordered"
                    className="border-[--moji-text-color] "
                    onPress={handleNext}
                  >
                    <RotateCw color="#020a5a" />
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
