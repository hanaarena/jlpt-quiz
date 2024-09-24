"use client";

import { Grape, Delete, Lightbulb, RotateCw } from "lucide-react";
import { Murecho } from "next/font/google";
import { cn } from "@/lib/utils";
import style from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { getRandomKanji } from "../data";
import { getRandomKana2 } from "../data/jp-kana";

const murecho = Murecho({
  weight: "600",
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function Kanji() {
  const [quiz, setQuiz] = useState<{
    index: number;
    kanji: string;
    kana: string;
    translation: string;
    type: string;
  }>({ index: 0, kanji: "", kana: "", translation: "", type: "" });
  const [answer, setAnswer] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [option, setOption] = useState<string[]>([]);

  useEffect(() => {
    const a = getRandomKanji();
    setQuiz(a);
  }, []);

  useEffect(() => {
    const arr = quiz.kana.split("");
    setAnswer(arr);
    const o = getRandomKana2(arr, 12);
    setOption(o);
  }, [quiz.kana]);

  const backspaceHandler = () => {
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center items-center",
        murecho.className
      )}
    >
      <div className="k-header flex w-full h-60 relative">
        <div className={style.curve}></div>
        <div
          className={cn(
            "absolute bottom-8 left-1/2 font-bold text-4xl -translate-x-1/2",
            style.title_text
          )}
        >
          N2漢字
        </div>
      </div>
      <div className="k-body mt-20 flex justify-center items-center relative flex-col">
        {showAnswer && (
          <div className="absolute -top-[28px] text-2xl tracking-widest">
            {quiz.kana}
          </div>
        )}
        <Suspense fallback={<div>loading...</div>}>
          <div className="text-7xl tracking-widest mb-3">{quiz.kanji}</div>
        </Suspense>
        <div className="flex mb-3">
          {answer.map((_, index) => (
            <div
              key={index}
              className={cn(
                "inline-block w-10 h-10 text-center leading-10 mr-2 last:mr-0",
                "border-b"
              )}
            >
              {userAnswer[index]}
            </div>
          ))}
        </div>
        <div className="flex w-1/2 flex-wrap gap-2 -mr-10">
          {option.map((item, index) => (
            <div
              key={index}
              className={cn(
                "inline-block w-10 h-10 rounded-full text-center leading-10",
                userAnswer.includes(item) ? "bg-blue-400" : "bg-gray-100"
              )}
              onClick={() => {
                if (userAnswer.includes(item)) {
                  setUserAnswer((prev) => prev.filter((i) => i !== item));
                } else if (userAnswer.length === answer.length) {
                  return;
                } else {
                  setUserAnswer((prev) => [...prev, item]);
                }
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="k-actions fixed left-1/2 -translate-x-1/2 bottom-10 flex items-center gap-10">
        <div className="border border-gray-300 rounded-full p-2">
          <Lightbulb color="#fad14f" />
        </div>
        <div
          className={cn(
            "border border-gray-300 rounded-full p-4",
            style.border_shadow
          )}
        >
          <Grape size={40} color="#424446" />
        </div>
        {showAnswer ? (
          <div className="border border-gray-300 rounded-full p-2">
            <RotateCw />
          </div>
        ) : (
          <div className="border border-gray-300 rounded-full p-2">
            <Delete
              color={answer.length ? "#f6776e" : "gray"}
              onClick={backspaceHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}
