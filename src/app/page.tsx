import Link from "next/link";
import styles from "./buttons.module.css";
import { cn } from "@heroui/react";
import BackgroundImage from "./components/BackgroundImage";

const EntryList = [
  {
    path: "/kanji",
    name: "漢字",
  },
  {
    path: "/grammar",
    name: "文法",
  },
  {
    path: "/moji",
    name: "語彙",
  },
  {
    path: "/moji-1",
    name: "文字(発音)",
  },
  {
    path: "/moji-3",
    name: "文字(単語)",
  },
  {
    path: "/sorting",
    name: "排序",
    disabled: true,
  },
];

export default async function Home() {
  return (
    <>
      <BackgroundImage src="/bg-0.jpeg" />
      <div className="max-w-3xl mx-auto grid grid-rows-[20px_0.8fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 relative">
        <p className="mt-20 text-4xl">Choose Quiz</p>
        <main className="z-10 flex flex-wrap gap-x-16 gap-y-8 justify-center">
          {EntryList.map((e) => {
            return (
              <Link key={e.path} href={e.disabled ? "" : e.path}>
                <button
                  className={cn(
                    styles.entry_btn,
                    "dark:bg-[#222] dark:text-white",
                    "before:dark:bg-[#0e2832]",
                    e.disabled &&
                      "!bg-gray-200 !text-gray-400 before:!bg-gray-400 !cursor-not-allowed"
                  )}
                  role="button"
                >
                  {e.name}
                </button>
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
}
