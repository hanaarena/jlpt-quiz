"use client";
import { useAppSelector } from "@/app/hooks";
import { selectorLevel } from "../mojiSlice";
import MojiHeader from "../header";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { ChatTypeValue } from "@/app/utils/const";

import { getRandomKanjiV2, type KanjiV2 } from "@/data/kanjiV2";
import { Button, cn } from "@heroui/react";
import { cheerful } from "@/app/utils/fns";
import { RotateCw } from "lucide-react";
import BackHomeLink from "@/app/components/backHomeLink";
import { changeThemeColor } from "@/app/utils/meta";
import { shuffleOptions } from "@/app/utils/quiz";
import BackgroundImage from "@/app/components/BackgroundImage";
import QuizAnsewerModal from "@/app/components/quizAnsewerModal";
import { post } from "@/app/utils/request";

interface IMojiQuiz {
  keyword: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  explanationOfOptions: string;
}

export default function MojiQuizPage() {
  const level = useAppSelector(selectorLevel);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({ options: [] } as unknown as IMojiQuiz);
  const [answer, setAnswer] = useState("");
  const queryClient = useQueryClient();

  async function wrapMutation(quiz: KanjiV2) {
    return post<{
      data: { generatedText: string; name: string; quizName: string };
    }>("/api/quiz/gemini/questions", {
      content: quiz.kana || quiz.kana,
      name: ChatTypeValue.Moji,
    });
  }

  const { mutate } = useMutation({
    mutationKey: ["moji"],
    mutationFn: wrapMutation,
    onMutate: () => {
      setAnswer("");
      setLoading(true);
    },
    onSuccess: (res) => {
      try {
        // `o` is quiz array:
        // [`keyword`, `question`, `options`, `answer`, `explanation`, `explanation of options`]
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
        const [
          keyword,
          question,
          options,
          answer,
          explanation,
          explanationOfOptions,
        ] = resultArr;
        let _question = question;
        if (!_question) {
          handleNext();
          return;
        }
        // 处理 question 中的填空后的第一个字符某些情况下会与 answer 最后一个字符重叠的问题
        const t = _question.replaceAll(/[＿|_]+/g, answer);
        const specifyIndex = t.search(
          /をを|がが|でで|にに|かか|なな|とと|てて/g
        );
        if (specifyIndex > -1) {
          // replace the last duplicate character from the end of the array
          const arr = t.split("");
          arr[specifyIndex - t.length + 1 + arr.length] = "";
          _question = arr.join("").replace(answer, "＿＿＿");
        }
        const [opts, ans] = shuffleOptions(options, answer);
        setQuiz({
          keyword,
          question: _question,
          options: opts,
          answer: ans,
          explanation,
          explanationOfOptions,
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        queryClient.invalidateQueries({ queryKey: ["moji"] });
      }
    },
    onError: (err) => {
      toast.error("Gemini failed: " + err, { duration: 2000 });
    },
    retryDelay: 1000,
    retry: 2,
  });

  function handleNext() {
    const _quiz = getRandomKanjiV2([...level][0]);
    if (_quiz.length) {
      mutate(_quiz[0]);
    }
  }

  useEffect(() => {
    if (!level.size) {
      redirect("/moji");
    }
    handleNext();
    changeThemeColor("#000b76");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="md:max-w-3xl md:mx-auto">
      <Toaster />
      <BackgroundImage src="/bg-4.jpeg" className="bg-opacity-80" />
      <div className="relative">
        <BackHomeLink className="-mt-3" />
        <MojiHeader />
        <main className="mt-14 px-6 max-w-3xl mx-auto">
          {loading ? (
            <LoadingV4Gemini />
          ) : (
            <>
              <div
                className="text-3xl mb-10 text-center"
                dangerouslySetInnerHTML={{ __html: quiz.question }}
              ></div>
              <div className="options flex flex-col gap-5 justify-center items-center min-w-full">
                {quiz.options.map((item, index) => (
                  <Button
                    key={index}
                    color="primary"
                    variant="ghost"
                    className={cn(
                      "w-9/12 text-[color:--moji-text-color] border-[--moji-text-color]",
                      "active:border-none text-lg",
                      answer && item === quiz.answer
                        ? "bg-green-500 border-green-500"
                        : answer === item &&
                            answer !== quiz.answer &&
                            "bg-red-500 border-red-500"
                    )}
                    onPress={() => {
                      setAnswer(item);
                      if (item === quiz.answer) {
                        cheerful();
                      } else {
                        toast.error("Wrong!", { duration: 2000 });
                      }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              {answer && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <QuizAnsewerModal>
                    <p className="text-lg font-bold">Explanation</p>
                    <div
                      dangerouslySetInnerHTML={{ __html: quiz.explanation }}
                      className="mb-4"
                    />
                    <p className="text-lg font-bold">Options explanation</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: quiz.explanationOfOptions.replaceAll(
                          "\n",
                          "<br>"
                        ),
                      }}
                    ></div>
                  </QuizAnsewerModal>
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
