"use client";

import { Grape, Delete, Lightbulb, RotateCw } from "lucide-react";
import { Murecho } from "next/font/google";
import { cn } from "@/lib/utils";
import style from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { getKanjiDetail, getRandomKanji, TKanjiDetail } from "../data";
import { getRandomKana2 } from "../data/jp-kana";
import { cheerful } from "../utils/fns";

type TKana = {
  kana: string;
  index: number;
};

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
    detail: TKanjiDetail;
  }>({
    index: 0,
    kanji: "",
    kana: "",
    translation: "",
    type: "",
    detail: {} as TKanjiDetail,
  });
  const [answer, setAnswer] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<TKana[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [option, setOption] = useState<string[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number[]>([]);

  useEffect(() => {
    updateQuiz();
  }, []);

  useEffect(() => {
    const arr = quiz.kana.split("");
    setAnswer(arr);
    const o = getRandomKana2(arr, 12);
    setOption(o);
  }, [quiz.kana]);

  const updateQuiz = () => {
    const a = getRandomKanji();
    setQuiz({ ...a, detail: getKanjiDetail(a.index) });
  };

  // 当前只支持提示第一个假名
  const showTip = () => {
    if (userAnswer.length) {
      return;
    }
    setUserAnswer((prev) => [
      ...prev,
      {
        kana: quiz.kana[0],
        index: option.indexOf(quiz.kana[0]),
      },
    ]);
  };
  const submit = () => {
    if (showAnswer) {
      reset();
      return;
    }
    const u = userAnswer.map((u) => u.kana);
    if (u.join("") === quiz.kana) {
      cheerful();
    } else {
      // find out which userAnswer's items is wrong
      userAnswer.forEach((u, index) => {
        if (u.kana !== quiz.kana[index]) {
          setWrongIndex((prev) => [...prev, index]);
        }
      });
    }
    setShowAnswer(true);
  };
  const backspaceHandler = () => {
    setUserAnswer((prev) => prev.slice(0, -1));
  };
  const reset = () => {
    setUserAnswer([]);
    setShowAnswer(false);
    setWrongIndex([]);
    updateQuiz();
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-center items-center",
        murecho.className
      )}
    >
      <div className="k-header flex w-full h-auto absolute top-6">
        <div className={style.curve}></div>
        <div
          className={cn(
            "absolute text-white left-1/2 font-bold text-2xl -translate-x-1/2 border border-white rounded px-1.5 py-0.5",
            style.title_text
          )}
        >
          <div className={cn(style.stars, "stars")}>
            <span className={style.s}></span>
            <span className={style.s}></span>
            <span className={style.s}></span>
            <span className={style.s}></span>
            <span className={style.s}></span>
            <span className={style.m}></span>
            <span className={style.m}></span>
            <span className={style.m}></span>
            <span className={style.m}></span>
            <span className={style.m}></span>
            <span className={style.l}></span>
            <span className={style.l}></span>
            <span className={style.l}></span>
            <span className={style.l}></span>
            <span className={style.l}></span>
          </div>
          N2漢字
        </div>
      </div>
      <div className="k-body flex justify-center items-center absolute flex-col top-[125px]">
        {showAnswer && (
          <div className="absolute -top-[30px] text-2xl tracking-widest">
            {quiz.kana}
          </div>
        )}
        <Suspense fallback={<div>loading...</div>}>
          <div className="text-6xl tracking-widest mb-2">{quiz.kanji}</div>
        </Suspense>
        <div className="user-answer-input flex mb-3">
          {answer.map((_, index) => (
            <div
              key={index}
              className={cn(
                "inline-block w-10 h-10 text-center leading-10 mr-2 last:mr-0",
                "border-b border-gray-400",
                showAnswer && wrongIndex.includes(index) ? "bg-red-400" : ""
              )}
            >
              {userAnswer[index]?.kana}
            </div>
          ))}
        </div>
        <div className="option-list flex w-1/2 flex-wrap gap-2 justify-center mb-3">
          {option.map((item, index) => (
            <div
              key={index}
              className={cn(
                "inline-block w-10 h-10 rounded-full text-center leading-10",
                userAnswer.some((u) => u.index === index)
                  ? "bg-yellow-200"
                  : "bg-gray-100"
              )}
              onClick={() => {
                if (userAnswer.some((u) => u.index === index)) {
                  setUserAnswer((prev) =>
                    prev.filter((i) => i.index !== index)
                  );
                } else if (userAnswer.length === answer.length) {
                  return;
                } else {
                  setUserAnswer((prev) => [...prev, { kana: item, index }]);
                }
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="answer-content min-h-[60px] w-11/12 text-center text-sm">
          {showAnswer ? (
            <>
              <div>
                漢字:{" "}
                <span className="p-0.5 px-1.5 bg-blue-400 rounded-sm">
                  {quiz.detail.char}
                </span>
                &nbsp;&nbsp;频次：{quiz.detail.frequency}
              </div>
              <div>
                音读: {quiz.detail.on} 训读：
                {quiz.detail.kun?.replace(".", "+") || "无"}
              </div>
              <div>翻译: {quiz.translation}</div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="k-actions fixed left-1/2 -translate-x-1/2 bottom-10 flex items-center gap-10">
        <div className="border border-gray-300 rounded-full p-2">
          <Lightbulb
            color={userAnswer.length ? "gray" : "#fad14f"}
            onClick={showTip}
          />
        </div>
        <div
          className={cn(
            "border border-gray-300 rounded-full p-4",
            style.border_shadow
          )}
        >
          <Grape size={40} color="#424446" onClick={submit} />
        </div>
        {showAnswer ? (
          <div className="border border-gray-300 rounded-full p-2">
            <RotateCw onClick={reset} />
          </div>
        ) : (
          <div className="border border-gray-300 rounded-full p-2">
            <Delete
              color={userAnswer.length ? "#f6776e" : "gray"}
              onClick={backspaceHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}
