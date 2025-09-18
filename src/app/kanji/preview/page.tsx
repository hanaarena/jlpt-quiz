"use client";

import { UndoDot, Volume2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn, Spinner } from "@heroui/react";
import Header from "../header";
import { useAppSelector } from "@/app/hooks";
import { selectorCount, selectorLevel } from "../kanjiSlice";
import { getRandomKanjiV2, KanjiV2, TKanjiV2 } from "@/data/kanjiV2";
import { cheerful } from "@/app/utils/fns";
import BackgroundImage from "@/app/components/BackgroundImage";
import { get } from "@/app/utils/request";

export default function StagePreview() {
  const level = useAppSelector(selectorLevel);
  const count = useAppSelector(selectorCount);
  const [currentIndex, setCurrentIndex] = useState(0); // current preview index
  const [progressCount, setProgressCount] = useState(0);
  const [list, setList] = useState<TKanjiV2>([]);
  const [show, setShow] = useState(false);
  const [end, setEnd] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [loadProun, setLoadProun] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  function pickNext() {
    setShow(false);
    setCurrentIndex(currentIndex + 1);
    setHistory((prev) => [...prev, currentIndex]);
  }

  // Rockback to previous kanji
  function pickPrev() {
    if (history.length > 0) {
      setShow(false);
      const lastIndex = history.pop();
      if (lastIndex !== undefined) {
        setCurrentIndex(lastIndex);
        setProgressCount((prev) => prev - 1);
      }
      setHistory((prev) => [...prev]);
    }
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
        setEnd(true);
      }
    }
  }

  async function getPronounce() {
    const item = list[currentIndex];
    if (!item) return;

    try {
      setLoadProun(true);
      if (audioRef.current && audioUrlRef.current) {
        audioRef.current.pause();
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch (_err) {
          /* TODO */
        }
        audioRef.current = null;
        audioUrlRef.current = null;
      }

      // fetch current word's pronunciation
      const res = await get<Response>(
        `/proxy?url=${encodeURIComponent(
          `https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=${item.kanji}&kana=${item.kana}`
        )}`,
        { isRaw: true }
      );
      if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const audio = new Audio(objectUrl);

      audioRef.current = audio;
      audioUrlRef.current = objectUrl;
      await audio.play();
      setLoadProun(false);
    } catch (err) {
      setLoadProun(false);
      console.error("Failed to play pronunciation:", err);
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch (_err) {
          /* ignore */
        }
        audioUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (count === 0) {
      redirect("/kanji");
    }
    const [l] = [...level];
    const kanjiList = getRandomKanjiV2(l, count);
    setList(kanjiList);
    setHistory([]);
    setCurrentIndex(0);
    setProgressCount(0);
    setEnd(false);
  }, [count, level]);

  return (
    <div>
      <BackgroundImage src="/bg-7.jpeg" className="bg-opacity-85" />
      <div className="relative md:max-w-3xl md:mx-auto">
        <Header />
        <main>
          <div className="flex justify-between items-center w-full pl-3 pr-6 pt-24 pb-1 bg-[#d8f3ff] mb-24 -mt-28 md:-mt-28">
            <button onClick={pickPrev} disabled={history.length === 0}>
              <UndoDot color="#080808" />
            </button>
            <p>
              Progress: {progressCount} / {count}
            </p>
          </div>
          {progressCount !== count && (
            <div className="relative w-11/12 flex flex-col items-center mx-auto">
              {list[currentIndex] && (
                <>
                  <p className="text-xl absolute -top-7 font-bold">
                    {list[currentIndex].kana !== list[currentIndex].kanji &&
                      show &&
                      list[currentIndex].kana}
                  </p>
                  <div
                    className={cn(
                      "mb-4 font-serif font-bold flex items-center",
                      list[currentIndex].kanji.length > 3
                        ? "text-7xl"
                        : "text-8xl",
                      list[currentIndex].kanji.length >= 5 && "text-5xl"
                    )}
                  >
                    {list[currentIndex].kanji}
                    <p
                      className="cursor-pointer ml-2 flex items-center w-6 h-6"
                      onClick={getPronounce}
                    >
                      {loadProun ? <Spinner size="sm" /> : <Volume2 />}
                    </p>
                  </div>
                  <p className="text-2xl break-all">
                    {show && list[currentIndex].meaning}
                  </p>
                </>
              )}
            </div>
          )}
          {end && (
            <div className="flex flex-col items-center -mt-12">
              <div className="bg-[url(/cheer.png)] bg-contain w-72 h-64"></div>
              <Link href="/kanji">
                <div className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none shadow-lg shadow-primary/40 bg-primary text-primary-foreground data-[hover=true]:opacity-hover text-xl w-40">
                  New Round
                </div>
              </Link>
            </div>
          )}
        </main>
        {!end && (
          <footer
            className={cn(
              "fixed bottom-0 flex w-full text-center h-14 items-center text-white text-xl",
              "md:max-w-3xl md:mx-auto"
            )}
          >
            {show ? (
              <>
                <div
                  className="flex-1 h-full bg-gray-500 flex items-center justify-center select-none cursor-pointer"
                  onClick={() => resortList(list[currentIndex])}
                >
                  Forget
                </div>
                <div
                  className="flex-1 h-full bg-[#09f] flex items-center justify-center select-none cursor-pointer"
                  onClick={handleNext}
                >
                  Remember
                </div>
              </>
            ) : (
              <div
                className="bg-[#d8f3ff] text-[#11325a] text-xl text-center w-full h-full flex items-center justify-center select-none cursor-pointer"
                onClick={() => setShow(true)}
              >
                Show Answer
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
