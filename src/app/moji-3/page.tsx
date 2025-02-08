import { Button } from "@heroui/button";
import LevelSelect from "./components/levelSelect";
import Moji1Header from "./header";
import Link from "next/link";
import GeminiSvg from "@/app/components/icons/gemini";
import BackHomeLink from "../components/backHomeLink";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#008080",
};

export const metadata: Metadata = {
  title: "文字(単語) - Exceed JLPT",
};

export default function Moji1Page() {
  return (
    <div>
      <div className="bg-[url(/bg-6.jpeg)] bg-cover bg-fixed min-h-screen w-full fixed bg-blend-lighten bg-white bg-opacity-85"></div>
      <div className="relative">
        <BackHomeLink className="-mt-1" />
        <Moji1Header />
        <main className="mt-6 px-7 max-w-3xl mx-auto">
          <div className="flex mb-16 items-center">
            <p className="text-4xl font-bold text-[#008080] mr-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.2)]">
              文字(単語) Quiz
            </p>
            <GeminiSvg className="w-7 h-7" />
          </div>
          <div className="ml-2">
            <LevelSelect />
            <Button
              as={Link}
              href="/moji-3/quiz"
              color="primary"
              variant="shadow"
              className="mt-2 text-lg px-6 bg-[#008080] text-white !shadow-[0_4px_4px_0px_rgba(0,128,128,0.25)]"
            >
              Start
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
