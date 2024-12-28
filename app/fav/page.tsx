"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { get, post } from "@/app/utils/request";
import { cn } from "@/lib/utils";
import IconHeart from "@/app/components/icons/IconHeart";

enum EFavType {
  Kanji = "kanji", // n2
  KanjiN1 = "kanji_n1",
}

const FavTypeMap = {
  [EFavType.Kanji]: "n2",
  [EFavType.KanjiN1]: "n1",
};

export default function Fav() {
  const queryParameters = new URLSearchParams(window.location.search);
  const favType = queryParameters.get("type") as EFavType;
  const [favList, setFavList] = useState<Record<string, TFavKanji>>({});

  useEffect(() => {
    getFavList();
  });

  const getFavList = async () => {
    post<{ result: TFavKanji[] }>(`/api/kanji/fav/list`, {
      type: favType,
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

  const handleToggleFav = (item: TFavKanji) => {
    let deleteAction = false;
    let data = {} as {
      id?: number;
      kanji?: string;
      hirakana?: string;
      type?: TFavKanji["type"];
    };
    if (favList.hasOwnProperty(item.kanji)) {
      data.id = favList[item.kanji].id;
      deleteAction = true;
    } else {
      data = {
        kanji: item.kanji,
        hirakana: item.hirakana,
        type: FavTypeMap[favType],
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
              kana: item.hirakana || item.kana,
              id: result.id,
              type: FavTypeMap[favType],
              kanji: item.kanji,
            },
          }));
        }
      })
      .catch((err) => {
        toast.error(err.toString(), { duration: 2000 });
      });
  };

  return (
    <div className="page-fav">
      <Toaster />
      {favList &&
        Object.keys(favList).map((kanji, index) => {
          const item = favList[kanji];
          return (
            <div
              key={`fav-${index}`}
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
          );
        })}
    </div>
  );
}
