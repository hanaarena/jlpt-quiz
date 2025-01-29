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
import { EFavKanjiType, EJLPTLevel } from "../types";
import { Switch } from "@nextui-org/react";
import { N2KanjiModeKey, setStorage } from "../utils/localstorage";

import type { IKanjiDetailRes } from "../data";
import { generateGemini } from "../actions/gemeni";
import { ChatTypeValue } from "../utils/const";
import LoadingV3 from "../components/loadingV3";
import { getRandomKanjiV2, KanjiV2, TKanjiV2 } from "../data/kanjiV2";

type TKana = {
  kana: string;
  index: number;
};

export default function Kanji() {
  const [quiz, setQuiz] = useState<KanjiV2>({
    kanji: "",
    kana: "",
    meaning: ""
  });
  const [userAnswer, setUserAnswer] = useState<TKana[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [option, setOption] = useState<string[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number[]>([]);
  const [showFrame, setShowFrame] = useState(false);
  const [viewed, setViewed] = useState<{ kanji: string; kana: string }[]>([]);
  const [showViewedDialog, setShowViewedDialog] = useState(false);
  const [favList, setFavList] = useState<{ [key: string]: TFavKanji }>({});
  const [isCoreMode, setIsCoreMode] = useState(false);
  const [kanjiExplanation, setKanjiExplanation] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  const updateQuiz = () => {
    const detail = getRandomKanjiV2(EJLPTLevel.N2)[0];
    setQuiz(detail);
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
        setKanjiExplanation("");
        generateGemini({
          content: quiz.kana || quiz.kanji,
          chatType: ChatTypeValue.N2KanjiExample
        }).then((res) => {
          setKanjiExplanation(res.text);
        });
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
    updateQuiz();
  }, []);

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
          <div className="flex gap-2">N2 kanji</div>
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
        <p>TODO</p>
        <Dialog
          open={showFrame}
          onOpenChange={(open) => {
            setShowFrame(open);
          }}
        >
          <DialogContent
            className={cn(
              "w-[90%]",
              "border-4 rounded-md border-solid border-yellow-400"
            )}
          >
            {/* <Iframe
              src={`https://m.dict.asia/jc/${quiz.kanji}`}
              className="w-full h-full"
            /> */}
            {kanjiExplanation ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: kanjiExplanation.replaceAll("\n", "<br>")
                }}
              ></div>
            ) : (
              <LoadingV3 />
            )}
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
