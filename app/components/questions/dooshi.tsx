"use client";

import RandomButton from "../randomButton";
import { useMemo, useState } from "react";
import { questionKeywordAtom, questionTypeAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";
import { randomDooshiKana } from "@/app/data";
import { ChatTypeValue } from "@/app/utils/const";
import Markdown from "react-markdown";
import Loading from "../loading";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CorrectIcon from "../icons/correct";
import { randomInRange } from "@/app/utils/fns";
import confetti from "canvas-confetti";
import WrongIcon from "../icons/wrong";

export default function Dooshi() {
  const [generation, setGeneration] = useState<IDooshiGenerationResult>();
  const [isLoading, setLoading] = useState(false);
  const questionType = useAtomValue(questionTypeAtom);
  const [keyword, setKeyword] = useAtom(questionKeywordAtom);
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast, dismiss } = useToast();
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const generate = async ({ content }) => {
    setKeyword(content);
    setLoading(true);
    setShowAnswer(false);
    await fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({
        content,
        chatType: ChatTypeValue.N2Dooshi,
      }),
    }).then((response) => {
      response.json().then((json) => {
        console.warn("kekek json", json);
        setGeneration(json);
        setLoading(false);
      });
    });
  };

  const handleSubmit = (ans: string) => {
    setShowAnswer(true);

    if (ans === generation?.questionAnswer) {
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
    } else {
      toast({
        variant: "destructive",
        title: "答错了！",
        duration: 2000,
      });
    }
  };

  const generateDooshi = () => {
    const d = randomDooshiKana();
    const { kana, kanji } = d;
    const v = `${kana}${kanji ? `(${kanji})` : ""}`;
    return v;
  };

  const replay = () => {
    setShowAnswer(false);
    setLoading(true);
    setSelectedAnswer("");
    dismiss();
    generate({ content: generateDooshi() });
  };

  useMemo(() => {
    if (questionType === 1) {
      generate({ content: generateDooshi() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType]);

  return (
    <div className="question-dooshi flex items-center flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        generation &&
        Object.keys(generation).length && (
          <>
            <div className="content-wrapper text-black ml-12 mb-6">
              <div className="question mb-6">動詞 ：{keyword}</div>
              <div className="answer">
                <h3 className="mb-4">题目: {generation.questionTitle}</h3>
                <h3 className="mb-4">
                  选项:{" "}
                  {generation.questionOptions.map((q) => (
                    <Button
                      key={q}
                      className={`relative hover:bg-black hover:text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] border font-medium leading-none focus:outline-none mr-2 ${
                        selectedAnswer === q
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        setSelectedAnswer(q);
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
                </h3>
                {showAnswer && (
                  <>
                    <h3>答案: </h3>
                    <Markdown>{generation.questionExplanation}</Markdown>
                  </>
                )}
              </div>
            </div>
            <RandomButton text="再来一题" onClick={replay} className="mb-4" />
          </>
        )
      )}
    </div>
  );
}
