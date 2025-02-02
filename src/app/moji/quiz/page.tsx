"use client";
import { useAppSelector } from "@/app/hooks";
import { selectorLevel } from "../mojiSlice";
import MojiHeader from "../header";
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
  const { isOpen, onOpenChange } = useDisclosure();

  async function wrapMutation(quiz: KanjiV2) {
    return generateGemini({
      content: quiz.kanji || quiz.kana,
      chatType: ChatTypeValue.N2Dooshi,
    });
  }

  const { mutate } = useMutation({
    mutationFn: wrapMutation,
    onMutate: () => {
      setAnswer("");
      setLoading(true);
    },
    onSuccess: (res) => {
      // o is quiz array:
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
      setQuiz({
        keyword,
        question,
        options: options.split("\n").map((item) => item.trim()),
        answer,
        explanation,
        explanationOfOptions,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Toaster />
      <MojiHeader />
      <main className="mt-44 px-6">
        {loading ? (
          <LoadingV4Gemini />
        ) : (
          <>
            <div className="text-3xl mb-10">{quiz.question}</div>
            <div className="options flex flex-col gap-3 justify-center items-center min-w-full">
              {quiz.options.map((item, index) => (
                <div key={index} className="w-9/12">
                  <Button
                    color="primary"
                    variant="ghost"
                    className={cn(
                      "w-full text-[color:--moji-text-color] border-[--moji-text-color]",
                      "active:border-none",
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
                </div>
              ))}
            </div>
            {answer && (
              <div className="flex justify-center">
                <Button
                  isIconOnly
                  aria-label="Next"
                  color="primary"
                  variant="bordered"
                  className="border-[--moji-text-color] mt-8"
                  onPress={handleNext}
                >
                  <RotateCw color="#020a5a" />
                </Button>
              </div>
            )}
          </>
        )}
        {/* TODO: explanation dialog */}
        <Modal
          isOpen={isOpen}
          placement="bottom"
          scrollBehavior={"inside"}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                  <div
                    dangerouslySetInnerHTML={{ __html: quiz.explanation }}
                    className="mb-4"
                  ></div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: quiz.explanationOfOptions,
                    }}
                  ></div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  );
}
