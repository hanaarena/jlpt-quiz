"use client";

import { Grape, Delete, Lightbulb, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import style from "./page.module.css";
import { Suspense, useEffect, useRef, useState } from "react";
import { getKanjiDetail, getRandomKanji, TKanjiDetail } from "../data";
import { getRandomKana2 } from "../data/jp-kana";
import { cheerful } from "../utils/fns";
import Iframe from "../components/iframe";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FloatingIconMenu from "./FloatingIconMenu";
import toast, { Toaster } from "react-hot-toast";

type TKana = {
  kana: string;
  index: number;
};

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
  const [showFrame, setShowFrame] = useState(false);
  const [viewed, setViewed] = useState<{ kanji: string; kana: string }[]>([]);
  const [showViewedDialog, setShowViewedDialog] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateQuiz();
  }, []);

  useEffect(() => {
    const arr = quiz.kana.split("");
    setAnswer(arr);
    const o = getRandomKana2(arr, 12);
    setOption(o);
  }, [quiz.kana]);

  const handleSelectTitle = () => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(textRef.current as Node);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const updateQuiz = () => {
    const a = getRandomKanji();
    setQuiz({ ...a, detail: getKanjiDetail(a.index) });
  };

  // 当前只支持提示第一个假名
  const showTip = () => {
    if (userAnswer.length || showAnswer) {
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
    setWrongIndex([]);
    setShowAnswer(false);
    updateQuiz();
    setViewed((prev) => [...prev, { kanji: quiz.kanji, kana: quiz.kana }]);
  };

  const openDialog = (type: TKanjiDialogType) => {
    switch (type) {
      case "frame":
        setShowFrame(true);
        break;
      case "viewed":
        if (!viewed.length) {
          toast.error("Viewed list is empty", { duration: 2000 });
          break;
        }
        setShowViewedDialog(true);
        break;
      case "fav":
        // todo: add fav dialog
        break;
    }
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-center items-center",
        style["page-kanji"]
      )}
    >
      <Toaster />
      <div className="k-header flex w-full h-auto absolute top-4">
        <div className={style.curve}></div>
        <div
          className={cn("absolute top-0 w-full", "flex justify-between px-4")}
        >
          <div
            className={cn(
              "text-black font-bold text-lg border border-black rounded px-1 py-0.1",
              style.title_text
            )}
          >
            N2漢字
          </div>
          <div className="">Viewed: {viewed.length || 0}</div>
        </div>
      </div>
      <div className="k-body flex justify-center items-center absolute flex-col top-[125px]">
        {showAnswer && (
          <div className="absolute -top-[30px] text-2xl tracking-widest">
            {quiz.kana}
          </div>
        )}
        <Suspense fallback={<div>loading...</div>}>
          <div
            className="text-6xl tracking-widest mb-2"
            ref={textRef}
            onClick={handleSelectTitle}
          >
            {quiz.kanji}
          </div>
        </Suspense>
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
        <div className="option-list text-xl flex w-8/12 flex-wrap gap-3 justify-center mb-4">
          {option.map((item, index) => (
            <div
              key={index}
              className={cn(
                "inline-block w-12 h-12 rounded-full text-center leading-[3rem]",
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
                <span className="p-0.5 px-1.5 bg-yellow-200 rounded-sm">
                  {quiz.detail.char}
                </span>
                &nbsp;&nbsp;频次：{quiz.detail.frequency}
              </div>
              <div>
                音读: {quiz.detail.on} 训读：
                {quiz.detail.kun?.replaceAll(".", "+") || "无"}
              </div>
              <div>
                翻译: {quiz.translation}&nbsp;。
                <div
                  className="text-yellow-500"
                  onClick={() => openDialog("frame")}
                >
                  例句
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <Dialog
          open={showFrame}
          onOpenChange={(open) => {
            setShowFrame(open);
          }}
        >
          <DialogContent
            className={cn(
              "w-[90%] h-3/4",
              "border-4 rounded-md border-solid border-yellow-400"
            )}
          >
            <Iframe
              src={`https://dict.asia/jc/${quiz.kanji}`}
              className="w-full h-full"
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="k-actions fixed left-1/2 -translate-x-1/2 bottom-10 flex items-center gap-10">
        <div className="border border-gray-300 rounded-full p-2">
          <Lightbulb
            color={userAnswer.length || showAnswer ? "gray" : "#fad14f"}
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
      <FloatingIconMenu openDialog={openDialog} />
      <Dialog
        open={showViewedDialog}
        onOpenChange={(open) => {
          setShowViewedDialog(open);
        }}
      >
        <DialogContent
          className={cn(
            "w-[96%] h-[96vh]",
            "border-4 rounded-md border-solid border-yellow-400"
          )}
        >
          {viewed.map((item, index) => (
            <div key={`viewed-${index}`} className="p-2">
              {index + 1}. {item.kanji}
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
