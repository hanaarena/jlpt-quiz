import {
  Button,
  Divider,
  Navbar,
  NavbarContent,
  NavbarItem,
  Spacer
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import EmblaCarousel from "../components/EmblaCarousel";
import GrammarV2DetailCard from "./card";

import style from "./page.module.css";
import type { GrammarLevelTypeV2, TGrammarV2 } from "../data/grammarV2";
import { GrammarSTAGE } from "../types";
import { useAtom } from "jotai";
import { grammarFavAtom, TGrammarFav, TGrammarFavProperty } from "./atom";
import { get, post } from "@/app/utils/request";
import IconHeart from "../components/icons/IconHeart";

interface StageReviewProps {
  level: GrammarLevelTypeV2;
  className?: string;
  grammarList: TGrammarV2[];
  index: number;
  handleChangGrammarSTAGE: (
    stage: GrammarSTAGE,
    level?: GrammarLevelTypeV2
  ) => void;
  updateGrammarIndex: (index: number) => void;
}

interface TFavResponse {
  result: TGrammarFavProperty;
}

export default function StageReview({
  level,
  className,
  grammarList,
  index,
  handleChangGrammarSTAGE,
  updateGrammarIndex
}: StageReviewProps) {
  const [grammarFav, setGrammarFav] = useAtom(grammarFavAtom);

  async function getFavList() {
    return await post<{ result: TGrammarFavProperty[] }>(
      `/api/grammar/fav/list`,
      {
        level,
        list: grammarList.map((item) => item.originalKey)
      }
    );
  }

  async function updateFav(idx: number) {
    const item = grammarList[idx];
    const key = item.originalKey;
    let isDelete = false;
    let data = {};
    if (grammarFav[key]) {
      isDelete = true;
      data = {
        id: grammarFav[key].id,
        key,
        level
      };
    } else {
      data = {
        key,
        level,
        meaning: item.meaning || item.english_meaning,
        example: item.examples.join("<split>")
      };
    }

    return await post<TFavResponse>(`/api/grammar/fav/update`, data)
      .then((res) => {
        if (res.result) {
          const obj = { ...grammarFav };
          if (isDelete) {
            delete obj[key];
          } else {
            obj[key] = res.result;
          }
          setGrammarFav(obj);
        }
      })
      .catch((err) => {
        toast.error(err.toString(), { duration: 2000 });
      });
  }

  const { mutate } = useMutation({
    mutationFn: getFavList,
    onSuccess: (res) => {
      if (res.result) {
        const obj = res.result.reduce((prev, curr) => {
          prev[curr.key] = curr;
          return prev;
        }, {} as TGrammarFav);
        setGrammarFav(obj);
      }
    },
    onError: (err) => {
      toast.error(err.toString(), { duration: 2000 });
    }
  });

  return (
    <div
      className={cn(
        "stage-review",
        style.default_bg_img,
        "min-h-screen",
        className
      )}
    >
      <Toaster />
      <Navbar classNames={{ base: "bg-[#fdedd3] py-4" }}>
        <NavbarContent justify="start">
          <NavbarItem>
            <div
              className={cn(
                "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
                "relative border bold",
                style.title_color,
                style.icon_bg,
                style.icon_border
              )}
            >
              {level.toUpperCase()}
            </div>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex items-center flex-col">
              <p className="bold text-2xl mb-2">
                {index + 1} / {grammarList.length}
              </p>
              <Button
                className={cn("ml-2 bg-[#e36f23] text-white")}
                size="sm"
                onPress={() => handleChangGrammarSTAGE(GrammarSTAGE.TESTING)}
              >
                Start
              </Button>
            </div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <EmblaCarousel
        className="px-4 py-2"
        options={{ loop: true }}
        onInit={() => {
          mutate();
        }}
        onSelect={(idx) => {
          if (idx !== index) {
            updateGrammarIndex(idx);
            window.scrollTo({ top: 0 });
          }
        }}
        control={{
          className:
            "fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-x-20",
          next: (
            <div className="relative w-24 text-center">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                Next
              </span>
            </div>
          ),
          prev: (
            <div className="relative w-24 text-center">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                Prev
              </span>
            </div>
          )
        }}
      >
        {grammarList.map((g, idx) => (
          <div key={`slide-${g.originalKey}`} className="embla__slide mb-12">
            <p className={cn("relative text-[#d36f32]", "text-4xl mt-3 mb-4")}>
              {g.originalKey}
              <IconHeart
                className="absolute top-1/2 -translate-y-1/2 right-0"
                shadow
                filled={Boolean(grammarFav[g.originalKey])}
                onClick={() => {
                  updateFav(idx);
                }}
              />
            </p>
            {g.grammar && (
              <GrammarV2DetailCard title={"Grammar"} content={g.grammar} />
            )}
            {g.meaning && <Spacer y={4} />}
            {g.meaning && (
              <GrammarV2DetailCard title={"Meaning"} content={g.meaning} />
            )}
            {g.english_meaning && <Spacer y={4} />}
            {g.english_meaning && (
              <GrammarV2DetailCard
                title={"English Meaning"}
                content={g.english_meaning}
              />
            )}
            {g.explanation && <Spacer y={4} />}
            {g.explanation && (
              <GrammarV2DetailCard
                title={"Explanation"}
                content={g.explanation}
              />
            )}
            {g.examples && <Spacer y={4} />}
            {g.examples && (
              <GrammarV2DetailCard
                className="max-h-96 overflow-y-auto"
                title={"Examples"}
              >
                {g.examples.map((e, i) => (
                  <div
                    key={`exp-${i}`}
                    className={cn(
                      "flex flex-col w-full rounded-lg border px-4 py-2 mb-2",
                      "last:mb-0 border-yellow-500 bg-yellow-500 bg-opacity-10"
                    )}
                  >
                    <p
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: e[0]
                      }}
                    />
                    <Divider className="my-2" />
                    <p
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: e[1]
                      }}
                    />
                    {/* compatible with v1 data which have third translation */}
                    {e[2] && (
                      <>
                        <Divider className="my-2" />
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[2]
                          }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </GrammarV2DetailCard>
            )}
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}
