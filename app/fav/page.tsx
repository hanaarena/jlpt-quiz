"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import { Pagination } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button
} from "@nextui-org/react";

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

const FavConfirm = ({
  children,
  item,
  deleteAction
}: {
  children: React.ReactNode;
  item: TFavKanji;
  deleteAction: (item: TFavKanji) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      showArrow
      offset={10}
      isOpen={isOpen}
      shouldBlockScroll
      onOpenChange={(open) => setIsOpen(open)}
      shouldCloseOnBlur
      // placement="bottom"
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="px-1 py-2 w-full">
          <p className="text-small font-bold text-foreground">
            Confirm to delete?
          </p>
          <div className="mt-2 flex gap-2 w-full">
            <Button size="sm" color="primary" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" size="sm" onPress={() => deleteAction(item)}>
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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
        pn: currentPage
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
    let data = {} as {
      id?: number;
      kanji?: string;
      hirakana?: string;
      type?: EFavKanjiType;
    };
    if (item.id) {
      data.id = item.id;
    } else {
      data = {
        kanji: item.kanji,
        hirakana: item.hirakana,
        type: EFavKanjiType[favType]
      };
    }
    post<{
      result: { id: number; type: string; hirakana: string; kanji: string };
    }>("/api/kanji/fav/update", data)
      .then(() => {
        mutate();
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
    onError: (err) => {
      toast.error(err.toString(), { duration: 2000 });
    }
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
          <p className="text-3xl underline relative py-4 px-4 bold text-[#e36f23]">
            Favourited List
          </p>
          <div
            className={cn(
              "content relative",
              "flex flex-col items-center",
              "mt-4"
            )}
          >
            {favList.length &&
              favList.map((item, index) => {
                return (
                  <div
                    key={`fav-${index}`}
                    className={cn(
                      "w-[90%] min-h-[84px] px-4 rounded-lg",
                      "flex justify-center items-center gap-[10px]",
                      "shadow-[0_1px_8px_rgba(0,0,0,0.1)]",
                      "mb-3 bg-white bg-opacity-90"
                    )}
                  >
                    <p className="mr-3">{index + 1}.</p>
                    <div className="flex-grow text-center">
                      <p className="text-sm bold">
                        {item.kana || item.hirakana}
                      </p>
                      <p className="text-4xl bold tracking-widest">
                        {item.kanji}
                      </p>
                    </div>
                    <FavConfirm item={item} deleteAction={handleToggleFav}>
                      <div>
                        <IconHeart filled shadow />
                      </div>
                    </FavConfirm>
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
                item: "text-lg"
              }}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <LoadingV3 className="z-10 mt-10" />
        </>
      )}
    </div>
  );
};
