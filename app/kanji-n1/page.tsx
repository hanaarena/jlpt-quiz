"use client";

import { Grape, Delete, Lightbulb, RotateCw } from "lucide-react";
import { Murecho } from "next/font/google";
import { cn } from "@/lib/utils";
import style from "./page.module.css";
import { useEffect, useState } from "react";
import { getRandomKanjiN1 } from "../data";
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
    kana: string;
    furigana: string;
    part: string;
    chinese: string;
  }>({ kana: "", furigana: "", part: "", chinese: "" });
  const [answer, setAnswer] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<TKana[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [option, setOption] = useState<string[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number[]>([]);

  useEffect(() => {
    updateQuiz();
  }, []);

  const updateQuiz = () => {
    let o = getRandomKanjiN1();
    // 过长的单词目前显示效果不佳
    if (o.kana.length > 17) {
      o = getRandomKanjiN1();
    }
    // pick answer from original kana
    const matches = o.furigana.match(/[\u3040-\u309F\u30A0-\u30FF]+/g);
    if (matches) {
      const arr = matches.join("").split("");
      setAnswer(arr);
      o.kana = o.kana.replace(/\[[^\]]*\]/g, "").trim();
      setQuiz(o);
      const options = getRandomKana2(arr, 12);
      setOption(options);
    }
  };

  // 当前只支持提示第一个假名
  const showTip = () => {
    if (userAnswer.length) {
      return;
    }
    setUserAnswer((prev) => [
      ...prev,
      {
        kana: answer[0],
        index: option.indexOf(answer[0]),
      },
    ]);
  };
  const submit = () => {
    if (showAnswer) {
      reset();
      return;
    }
    const u = userAnswer.map((u) => u.kana);
    if (u.join("") === answer.join("")) {
      cheerful();
    } else {
      // find out which userAnswer's items is wrong
      userAnswer.forEach((u, index) => {
        if (u.kana !== answer[index] || !u.kana) {
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
          N1词汇
        </div>
      </div>
      <div className="k-body flex justify-center items-center absolute flex-col top-[125px]">
        {showAnswer ? (
          <div
            className="text-6xl tracking-widest mb-2"
            dangerouslySetInnerHTML={{ __html: quiz.furigana }}
          ></div>
        ) : (
          <div className="text-6xl tracking-widest mb-2">{quiz.kana}</div>
        )}
        <div className="user-answer-input flex mb-6">
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
              <div>翻译: {quiz.chinese}</div>
              {quiz.part && <div>词性：{quiz.part}</div>}
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
