"use client";

import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import { Pagination } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

import { post } from "@/app/utils/request";
import { cn } from "@/lib/utils";
import IconHeart from "@/app/components/icons/IconHeart";
import { EFavKanjiType } from "../types";
import KanjiStyle from "../kanji/page.module.css";
import LoadingV3 from "../components/loadingV3";

const defaultType = EFavKanjiType["Kanji"];

export default function FavWrapper() {
  return (
    <div className="fav-wrapper">
      <Toaster />
      <Fav />
    </div>
  );
}

const Fav = () => {
  const ps = 20;
  const params = useParams<{ type: EFavKanjiType }>();
  const { type: favType = defaultType } = params;
  const [favList, setFavList] = useState<TFavKanji[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getFavList = async () => {
    const res = await post<{ result: { total: number; list: TFavKanji[] } }>(
      `/api/kanji/fav/page`,
      {
        type: favType,
        ps,
        pn: currentPage,
      }
    );

    const { result } = res;
    const { total, list } = result;

    setTotalPage(Math.ceil(total / ps));

    if (list.length) {
      setFavList(list);
    }

    return res;
  };

  const handleToggleFav = (item: TFavKanji) => {
    let deleteAction = false;
    let data = {} as {
      id?: number;
      kanji?: string;
      hirakana?: string;
      type?: EFavKanjiType;
    };
    if (favList.hasOwnProperty(item.kanji)) {
      data.id = favList[item.kanji].id;
      deleteAction = true;
    } else {
      data = {
        kanji: item.kanji,
        hirakana: item.hirakana,
        type: EFavKanjiType[favType],
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
              type: EFavKanjiType[favType],
              kanji: item.kanji,
            },
          }));
        }
      })
      .catch((err) => {
        toast.error(err.toString(), { duration: 2000 });
      });
  };

  const { mutate, isSuccess } = useMutation({
    mutationFn: getFavList,
    onSuccess: (res) => {
      const { result } = res;
      const { total, list } = result;
      setTotalPage(Math.ceil(total / ps));
      if (list.length) {
        setFavList(list);
      }
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div className="page-fav">
      {isSuccess ? (
        <>
          <div className="fixed z-1">
            <div className={KanjiStyle.curve}></div>
          </div>
          <div className="content relative">
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
                      <p className="text-4xl bold tracking-widest">
                        {item.kanji}
                      </p>
                    </div>
                    <IconHeart
                      filled={favList[item.kanji] ? true : false}
                      onClick={() => handleToggleFav(item)}
                    />
                  </div>
                );
              })}
            <Pagination
              showShadow
              showControls
              color="warning"
              initialPage={1}
              total={totalPage}
              page={currentPage}
              className="flex mx-auto my-0 justify-center"
              classNames={{
                cursor: "text-lg bold",
                item: "text-lg",
              }}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </>
      ) : (
        <LoadingV3 className="z-10" />
      )}
    </div>
  );
};
