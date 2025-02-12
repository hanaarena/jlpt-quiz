import type { Metadata, Viewport } from "next";

import Header from "./header";
import LevelSelect from "./components/levelSelect";
import WordRange from "./components/wordRange";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kanji - Exceed JLPT",
};
export const viewport: Viewport = {
  themeColor: "#09f",
  // themeColor: [
  //     { media: "(prefers-color-scheme: dark)", color: "#000000" },
  //     { media: "(prefers-color-scheme: light)", color: "#ffffff" }
  //    ]
};

export default async function Kanji() {
  return (
    <div className="md:max-w-3xl md:mx-auto">
      <div className="bg-[url(/bg-7.jpeg)] bg-cover bg-fixed min-h-screen md:max-w-3xl md:mx-auto w-full fixed bg-blend-lighten bg-white bg-opacity-85"></div>
      <div className="relative">
        <Header />
        <main className="z-10">
          <div className="mt-32 flex flex-col items-center justify-center w-[75%] mx-auto">
            <p className="text-4xl bold mb-12 z-10">漢字 Preview</p>
            <div className="content flex flex-col w-full mb-16">
              <LevelSelect />
              <div className="word-range flex flex-row items-center">
                <WordRange />
              </div>
            </div>
            <Link href="/kanji/preview">
              <div className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none shadow-lg shadow-primary/40 bg-primary text-primary-foreground data-[hover=true]:opacity-hover text-xl w-28">
                Start
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
