"use client";

import { Grape, Delete, Lightbulb, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import style from "./page.module.css";
import { useEffect, useState } from "react";
import {
  getKanjiDetailByIndex,
  getKanjiDetailByKana,
  getRandomKanji,
  TKanjiDetail
} from "../data";
import { getRandomKana2 } from "../data/jp-kana";
import { cheerful } from "../utils/fns";
import Iframe from "../components/iframe";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FloatingIconMenu from "./FloatingIconMenu";
import toast, { Toaster } from "react-hot-toast";
import IconHeart from "../components/icons/IconHeart";
import { get, post } from "../utils/request";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { EFavKanjiType } from "../types";
import { Switch } from "@nextui-org/react";
import { getStorage, N2KanjiModeKey, setStorage } from "../utils/localstorage";

import type { IKanjiDetailRes } from "../data";

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
    detail: {} as TKanjiDetail
  });
  const [answer, setAnswer] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<TKana[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [option, setOption] = useState<string[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number[]>([]);
  const [showFrame, setShowFrame] = useState(false);
  const [viewed, setViewed] = useState<{ kanji: string; kana: string }[]>([]);
  const [showViewedDialog, setShowViewedDialog] = useState(false);
  const [favList, setFavList] = useState<{ [key: string]: TFavKanji }>({});
  const [isCoreMode, setIsCoreMode] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const arr = quiz.kana.split("");
    setAnswer(arr);
    const o = getRandomKana2(arr, 12);
    setOption(o);
  }, [quiz.kana]);

  const updateQuiz = () => {
    const mode = isCoreMode ? "core" : "all";
    const directWord = params.get("word");
    let detail = {} as IKanjiDetailRes;
    let specWordDetail: IKanjiDetailRes | undefined;

    if (directWord) {
      specWordDetail = getKanjiDetailByKana(directWord);
    }
    if (specWordDetail) {
      detail = specWordDetail;
    } else {
      detail = getRandomKanji(mode);
    }

    setQuiz({
      ...detail,
      detail: getKanjiDetailByIndex(detail.index, directWord ? "all" : mode)
    });
    // detele param -> "word"
    if (directWord) {
      router.replace("/kanji");
    }
    // check if the kanji whether favorited
    get<{ result: TFavKanji }>(`/api/kanji/fav/check/${detail.kanji}`).then(
      (res) => {
        if (res.result?.id) {
          setFavList((prev) => ({
            ...prev,
            [detail.kanji]: res.result
          }));
        }
      }
    );
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
        index: option.indexOf(quiz.kana[0])
      }
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

  const openDialog = (type: TKanjiDialogType) => {
    switch (type) {
      case "viewed":
        if (!viewed.length) {
          toast.error("Viewed list is empty", { duration: 2000 });
          break;
        }
        setShowViewedDialog(true);
        break;
      case "fav":
        window.history.pushState(null, "", "/fav?type=kanji");
        router.push("/fav?type=kanji");
        break;
      case "frame":
        setShowFrame(true);
        break;
    }
  };

  const getViewedFavStatus = () => {
    const list = viewed.map((item) => item.kanji);
    post<{ result: TFavKanji[] }>("/api/kanji/fav/list", {
      list,
      type: EFavKanjiType.Kanji
    }).then((res) => {
      const { result } = res;
      if (result.length) {
        setFavList((prev) => {
          const newList = result.reduce((acc, cur) => {
            acc[cur.kanji] = cur;
            return acc;
          }, prev);
          return newList;
        });
      }
    });
  };

  const handleToggleFav = (
    item: { kanji: string; id?: number } | TFavKanji
  ) => {
    let deleteAction = false;
    let data = {} as {
      id?: number;
      kanji?: string;
      hirakana?: string;
      type?: "n2";
    };
    if (favList.hasOwnProperty(item.kanji)) {
      data.id = favList[item.kanji].id;
      deleteAction = true;
    } else {
      data = {
        kanji: item.kanji,
        hirakana: quiz.kana,
        type: "n2"
      };
    }
    post<{
      result: { id: number; type: string; hirakana: string; kanji: string };
    }>("/api/kanji/fav/update", data)
      .then((res) => {
        const { result } = res;
        if (deleteAction) {
          setFavList((prev) => {
            const newList = { ...prev };
            delete newList[item.kanji];
            return newList;
          });
        } else {
          setFavList((prev) => ({
            ...prev,
            [item.kanji]: {
              kana: quiz.kana,
              id: result.id,
              type: EFavKanjiType.Kanji,
              kanji: item.kanji
            }
          }));
        }
      })
      .catch((err) => {
        toast.error(err.toString(), { duration: 2000 });
      });
  };

  const reset = () => {
    setUserAnswer([]);
    setWrongIndex([]);
    setShowAnswer(false);
    if (quiz.kanji) {
      setViewed((prev) => [...prev, { kanji: quiz.kanji, kana: quiz.kana }]);
    }
    updateQuiz();
  };

  useEffect(() => {
    const mode = getStorage(N2KanjiModeKey);
    if (mode) {
      setIsCoreMode(mode === "core");
    }
    updateQuiz();
  }, []);

  useEffect(() => {
    reset();
  }, [isCoreMode]);

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
          <div className="flex gap-2">
            <Switch
              color="warning"
              isSelected={isCoreMode}
              onValueChange={(v) => {
                setStorage(N2KanjiModeKey, v ? "core" : "all");
                setIsCoreMode(v);
              }}
            >
              {isCoreMode ? "Core N2 Kanji" : "All N2 Kanji"}
            </Switch>
          </div>
          <div onClick={() => openDialog("viewed")}>
            Viewed: {viewed.length || 0}
          </div>
        </div>
      </div>
      <div className="k-body flex justify-center items-center absolute flex-col top-[106px]">
        {showAnswer && (
          <div className="absolute -top-[30px] text-2xl tracking-widest">
            {quiz.kana}
          </div>
        )}
        <div className="text-6xl tracking-widest mb-2 relative">
          {quiz.kanji}
          <IconHeart
            className="absolute -right-[30px] top-1/2"
            filled={favList[quiz.kanji] ? true : false}
            onClick={() => handleToggleFav({ kanji: quiz.kanji })}
            shadow={favList[quiz.kanji] ? true : false}
          />
        </div>
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
              <div>翻译: {quiz.translation}&nbsp;。</div>
              <div
                className="text-yellow-500 my-0 mx-auto w-fit"
                onClick={() => openDialog("frame")}
              >
                查看例句
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
              "w-[90%] h-[80%]",
              "border-4 rounded-md border-solid border-yellow-400"
            )}
          >
            <Iframe
              src={`https://m.dict.asia/jc/${quiz.kanji}`}
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
          if (open) {
            getViewedFavStatus();
          }
        }}
      >
        <DialogContent
          className={cn(
            "flex flex-col w-[90%] h-[80%]",
            "border-4 rounded-lg border-solid border-yellow-400",
            "overflow-y-scroll",
            style.viewed_dialog
          )}
          aria-describedby=""
        >
          <DialogTitle style={{ display: "none" }}></DialogTitle>
          {viewed.map((item, index) => (
            <div
              key={`viewed-${index}`}
              className={cn(
                "px-4 min-h-[84px] bg-white rounded-lg",
                "flex justify-start items-center gap-[10px]",
                "shadow-[0_1px_8px_rgba(0,0,0,0.1)]"
              )}
            >
              <p className="mr-3">{index + 1}.</p>
              <div className="flex-grow text-center">
                <p className="text-sm">{item.kana}</p>
                <p className="text-4xl bold tracking-widest">{item.kanji}</p>
              </div>
              <IconHeart
                filled={favList[item.kanji] ? true : false}
                onClick={() => handleToggleFav(item)}
              />
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
