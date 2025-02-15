"use client";
import { useAppSelector } from "@/app/hooks";
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

interface IMoji1Quiz {
  keyword: string;
  question: string;
  options: string[];
  answer: string;
  furigana: string;
  translation: string;
}

export default function Moji1QuizPage() {
  const level = useAppSelector(selectorLevel);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({ options: [] } as unknown as IMoji1Quiz);
  const [answer, setAnswer] = useState("");
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

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
      setQuiz({
        keyword,
        question: question.replace(/\([^)]*\)/g, ""),
        options: opts,
        answer: ans,
        furigana,
        translation,
      });
      setLoading(false);
    },
    onError: (err) => {
      toast.error("Gemini failed: " + err, { duration: 2000 });
    },
    retryDelay: 1000,
    retry: 2,
  });

  function handleNext() {
    setAnswer("");
    const _quiz = getRandomKanjiV2([...level][0], 1, true);
    if (_quiz.length) {
      mutate(_quiz[0]);
    }
  }

  useEffect(() => {
    if (!level.size) {
      redirect("/moji-1");
    }
    handleNext();
    document.title = "文字① - Exceed JLPT";
    changeThemeColor("#FFAA33");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="md:max-w-3xl md:mx-auto">
      <div className="bg-[url(/bg-5.jpeg)] bg-cover bg-fixed min-h-screen md:max-w-3xl md:mx-auto w-full fixed bg-blend-lighten bg-white bg-opacity-90"></div>
      <Toaster />
      <div className="relative">
        <BackHomeLink className="-mt-3" />
        <Moji1Header />
        <main className="mt-14 px-6 max-w-3xl mx-auto">
          {loading ? (
            <LoadingV4Gemini />
          ) : (
            <>
              <div
                className="text-3xl mb-10 text-center"
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
                          "w-9/12 border-black text-black",
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
                    )
                )}
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
                    <p className="text-lg font-bold">Translation</p>
                    <p
                      className="font-bold text-xl"
                      dangerouslySetInnerHTML={{ __html: quiz.furigana }}
                    ></p>
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{
                        __html: quiz.translation,
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
