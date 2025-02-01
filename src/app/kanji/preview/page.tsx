"use client";

import { ArrowLeft } from "lucide-react";
import Header from "../header";
import { useAppSelector } from "@/app/hooks";
import { selectorCount, selectorLevel } from "../kanjiSlice";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getRandomKanjiV2, KanjiV2, TKanjiV2 } from "@/data/kanjiV2";
import { Button, cn } from "@heroui/react";
import { cheerful } from "@/app/utils/fns";

export default function StagePreview() {
  const level = useAppSelector(selectorLevel);
  const count = useAppSelector(selectorCount);
  const [currentIndex, setCurrentIndex] = useState(0); // current preview index
  const [progressCount, setProgressCount] = useState(0);
  const [list, setList] = useState<TKanjiV2>([]);
  const [show, setShow] = useState(false);

  if (count === 0) {
    redirect("/kanji");
  }

  function pickNext() {
    setShow(false);
    setCurrentIndex(currentIndex + 1);
  }

  function resortList(kanji: KanjiV2) {
    const index = list.findIndex((item) => item.kanji === kanji.kanji);
    const newList = [...list];
    if (index >= list.length - 2) {
      // push newList[index] into last one of newList
      newList.splice(list.length - 1, 0, newList[index]);
    } else {
      newList.splice(index + 3, 0, newList[index]);
    }
    setList(newList);
    pickNext();
  }

  function handleNext() {
    if (progressCount < count) {
      pickNext();
      const n = progressCount + 1;
      setProgressCount(n);
      if (n === count) {
        cheerful();
      }
    }
  }

  useEffect(() => {
    const [l] = [...level];
    const kanjiList = getRandomKanjiV2(l, count);
    setList(kanjiList);
  }, [count, level]);

  return (
    <div>
      <header className="fixed top-0 left-0 w-full">
        <Header />
      </header>
      <main className="z-1">
        <div className="flex justify-between items-center w-full pl-3 pr-6 pt-24 pb-1 bg-[#d8f3ff] mb-24">
          <Link href={"/kanji"}>
            <ArrowLeft color="#080808" />
          </Link>
          <p>
            Progress: {progressCount} / {count}
          </p>
        </div>
        {progressCount !== list.length ? (
          <div className="relative w-11/12 flex flex-col items-center mx-auto">
            {list[currentIndex] && (
              <>
                <p className="text-xl absolute -top-7">
                  {list[currentIndex].kana !== list[currentIndex].kanji &&
                    show &&
                    list[currentIndex].kana}
                </p>
                <p
                  className={cn(
                    "font-light mb-4",
                    list[currentIndex].kanji.length > 3
                      ? "text-7xl"
                      : "text-8xl",
                    list[currentIndex].kanji.length >= 5 && "text-5xl"
                  )}
                >
                  {list[currentIndex].kanji}
                </p>
                <p className="text-2xl break-all">
                  {show && list[currentIndex].meaning}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center -mt-12">
            <div className="bg-[url(/cheer.png)] bg-contain w-72 h-64"></div>
            <Button
              as={Link}
              href="/kanji"
              color="primary"
              variant="shadow"
              className="text-xl w-40"
            >
              New Round
            </Button>
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 flex w-full text-center h-14 items-center text-white text-xl">
        {show ? (
          <>
            <div
              className="flex-1 h-full bg-gray-500 flex items-center justify-center"
              onTouchStart={() => resortList(list[currentIndex])}
            >
              Forget
            </div>
            <div
              className="flex-1 h-full bg-[#09f] flex items-center justify-center"
              onTouchStart={handleNext}
            >
              Remember
            </div>
          </>
        ) : (
          <div
            className="bg-[#d8f3ff] text-[#11325a] text-xl text-center w-full h-full flex items-center justify-center"
            onTouchStart={() => setShow(true)}
          >
            Show Answer
          </div>
        )}
      </footer>
    </div>
  );
}
