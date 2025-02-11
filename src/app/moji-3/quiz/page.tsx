"use client";
import { useAppSelector } from "@/app/hooks";
import { selectorLevel } from "../moji3Slice";
import Moji1Header from "../header";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";
import { generateGemini } from "@/app/actions/gemini";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { ChatTypeValue } from "@/app/utils/const";

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

interface IMoji3Quiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  translation: string;
}

export default function Moji3QuizPage() {
  const level = useAppSelector(selectorLevel);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({ options: [] } as unknown as IMoji3Quiz);
  const [answer, setAnswer] = useState("");
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  async function wrapMutation() {
    return generateGemini({
      content: "hoolala",
      chatType: ChatTypeValue.N2Moji3,
      model: "models/gemini-2.0-flash-lite-preview-02-05",
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
      const [question, options, answer, translation, explanation] = resultArr;
      if (options.split("\n").length < 4) {
        return Promise.reject("parsing failed, try again");
      }
      setQuiz({
        question: question.replace(/\([^)]*\)/g, ""),
        options: options
          .split("\n")
          .filter((i) => i)
          .map((item) => item.replaceAll(" ", "")),
        answer: answer.replaceAll(" ", ""),
        explanation: explanation?.replaceAll("\n", "<br />"),
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
    mutate();
  }

  useEffect(() => {
    if (!level.size) {
      redirect("/moji-3");
    }
    handleNext();
    document.title = "文字(単語) - Exceed JLPT";
    changeThemeColor("#008080");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="bg-[url(/bg-6.jpeg)] bg-cover bg-fixed min-h-screen w-full fixed bg-blend-lighten bg-white bg-opacity-85"></div>
      <Toaster />
      <div className="relative">
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
                    className="border-[--moji3-text-color] "
                    onPress={handleNext}
                  >
                    <RotateCw color="#008080" />
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
                    <div
                      className="mb-4"
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
