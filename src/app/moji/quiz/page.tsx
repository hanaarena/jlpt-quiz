"use client";
import { useAppSelector } from "@/app/hooks";
import { selectorLevel } from "../mojiSlice";
import MojiHeader from "../header";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";
import { generateGemini } from "@/app/actions/gemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { ChatTypeValue } from "@/app/utils/const";

import { getRandomKanjiV2, type KanjiV2 } from "@/data/kanjiV2";
import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { cheerful } from "@/app/utils/fns";
import { RotateCw } from "lucide-react";
import BackHomeLink from "@/app/components/backHomeLink";
import { changeThemeColor } from "@/app/utils/meta";
import { shuffleOptions } from "@/app/utils/quiz";

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
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const queryClient = useQueryClient();

  async function wrapMutation(quiz: KanjiV2) {
    return generateGemini({
      content: quiz.kanji || quiz.kana,
      chatType: ChatTypeValue.N2Dooshi,
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
        const specifyIndex = t.search(/をを|がが|でで|にに|かか|なな|とと/g);
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
      <div className="bg-[url(/bg-4.jpeg)] bg-cover bg-fixed min-h-screen md:max-w-3xl md:mx-auto w-full fixed bg-blend-lighten bg-white bg-opacity-80"></div>
      <div className="relative">
        <BackHomeLink className="-mt-3" />
        <MojiHeader />
        <main className="mt-14 px-6 max-w-3xl mx-auto">
          {loading ? (
            <LoadingV4Gemini />
          ) : (
            <>
              <div className="text-3xl mb-10">
                <span className="border border-[--moji-text-color] rounded-xl text-md px-2 text-[color:var(--moji-text-color)]">
                  Q
                </span>
                &#8201;
                {quiz.question}
              </div>
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
                  <p className="underline" onClick={onOpen}>
                    Detail
                  </p>
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
          <Modal
            isOpen={isOpen}
            placement="bottom"
            scrollBehavior={"inside"}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {() => (
                <>
                  <ModalBody className="max-h-80 bg-[url('/bg-3.png')] bg-cover bg-center bg-blend-lighten bg-white bg-opacity-80">
                    <p className="text-lg font-bold">Explanation</p>
                    <div
                      dangerouslySetInnerHTML={{ __html: quiz.explanation }}
                      className="mb-4"
                    ></div>
                    <p className="text-lg font-bold">Options explanation</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: quiz.explanationOfOptions.replaceAll(
                          "\n",
                          "<br>"
                        ),
                      }}
                    ></div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </main>
      </div>
    </div>
  );
}
