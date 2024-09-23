import { cn } from "@/lib/utils";
import style from "./page.module.css";

export default function Kanji() {
  return (
    <div className="page-kanji flex flex-col min-h-screen bg-white">
      <div className="k-header flex w-full h-60 relative">
        <div className={style.curve}></div>
        <div
          className={cn(
            "absolute bottom-8 left-[30%] font-bold text-6xl",
            style.title_text
          )}
        >
          N2漢字
        </div>
      </div>
      <div className="k-body flex justify-center">boy</div>
      <div className="k-actions"></div>
    </div>
  );
}
