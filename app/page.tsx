"use client";
import { useAtom } from "jotai";
import Contents from "./components/contents";
import Sidebar from "./components/sidebar";
import { collapsedAtom } from "./components/atoms";
import { cn } from "@/lib/utils";

export default function Home() {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom);

  return (
    <main className="flex min-h-screen bg-white">
      <div className="top-head flex fixed left-0 top-0 w-full h-14 bg-white z-10 border-b -mt-1">
        <div
          className={cn(
            "mobile-nav block opacity-0 relative left-3 top-5 cursor-pointer",
            collapsed && "opacity-100"
          )}
          onTouchStart={() => {
            setCollapsed((prev) => !prev);
          }}
        >
          <div className="w-[20px] h-[3px] bg-black mb-1"></div>
          <div className="w-[20px] h-[3px] bg-black mb-1"></div>
          <div className="w-[20px] h-[3px] bg-black"></div>
        </div>
        <div className="title-wrapper m-auto w-auto">
          <section className="sweet-title">
            <span data-text="JLPT EASY!">JLPT EASY!</span>
          </section>
        </div>
      </div>
      <Sidebar />
      <Contents />
    </main>
  );
}
