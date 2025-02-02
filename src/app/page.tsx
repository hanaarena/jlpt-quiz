import Link from "next/link";
import styles from "./buttons.module.css";
import { cn } from "@heroui/react";

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
    path: "/sorting",
    name: "排序",
  },
];

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_0.8fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
      <p className="mt-14 text-4xl">Choose Quiz</p>
      <main className="z-10 flex flex-wrap gap-x-16 gap-y-8 justify-center">
        {EntryList.map((e) => {
          return (
            <Link key={e.path} href={e.path}>
              <button
                className={cn(
                  styles.entry_btn,
                  "dark:bg-[#222] dark:text-white",
                  "before:dark:bg-[#0e2832]"
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
  );
}
