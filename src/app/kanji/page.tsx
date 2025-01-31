import type { Metadata, Viewport } from "next";

import Header from "./header";
import LevelSelect from "./components/levelSelect";
import WordRange from "./components/wordRange";
import { Button } from "@heroui/button";
import PreviewBtn from "./components/previewBtn";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kanji - Exceed JLPT",
};
export const viewport: Viewport = {
  themeColor: "#0a6fdb",
};

export default async function Kanji() {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full">
        <Header />
      </header>
      <main>
        <div className="mt-32 flex flex-col items-center justify-center w-[75%] mx-auto font-[family-name:var(--font-jpn)]">
          <p className="text-4xl bold mb-12">漢字 Preview</p>
          <div className="content flex flex-col w-full mb-16">
            <LevelSelect />
            <div className="word-range flex flex-row items-center">
              <p className="flex-auto">Words count</p>
              <WordRange />
            </div>
          </div>
          <Button
            as={Link}
            href="/kanji/preview"
            color="primary"
            variant="shadow"
            className="text-xl w-28"
          >
            Start
          </Button>
        </div>
      </main>
    </div>
  );
}
