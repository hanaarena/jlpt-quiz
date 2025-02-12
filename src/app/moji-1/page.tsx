import { Button } from "@heroui/button";
import LevelSelect from "./components/levelSelect";
import Moji1Header from "./header";
import Link from "next/link";
import GeminiSvg from "@/app/components/icons/gemini";
import BackHomeLink from "../components/backHomeLink";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#FFAA33",
};

export const metadata: Metadata = {
  title: "文字(発音) - Exceed JLPT",
};

export default function Moji1Page() {
  return (
    <div className="md:max-w-3xl md:mx-auto">
      <div className="bg-[url(/bg-5.jpeg)] bg-cover bg-fixed min-h-screen md:max-w-3xl md:mx-auto w-full fixed bg-blend-lighten bg-white bg-opacity-90"></div>
      <div className="relative">
        <BackHomeLink className="-mt-3" />
        <Moji1Header />
        <main className="mt-6 px-7 max-w-3xl mx-auto">
          <div className="flex mb-16 items-center">
            <p className="text-4xl font-bold text-[#FFAA33] mr-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.2)]">
              文字(発音) Quiz
            </p>
            <GeminiSvg className="w-7 h-7" />
          </div>
          <div className="ml-2">
            <LevelSelect />
            <Button
              as={Link}
              href="/moji-1/quiz"
              color="primary"
              variant="shadow"
              className="mt-2 text-lg px-6"
            >
              Start
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
