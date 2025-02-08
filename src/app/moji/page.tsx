import { Button } from "@heroui/button";
import LevelSelect from "./components/levelSelect";
import MojiHeader from "./header";
import Link from "next/link";
import GeminiSvg from "@/app/components/icons/gemini";
import BackHomeLink from "../components/backHomeLink";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000b76",
};

export default function MojiPage() {
  return (
    <div>
      <div className="bg-[url(/bg-4.jpeg)] bg-cover bg-fixed min-h-screen w-full fixed bg-blend-lighten bg-white bg-opacity-80"></div>
      <div className="relative">
        <BackHomeLink className="-mt-3" />
        <MojiHeader />
        <main className="-mt-6 px-7 max-w-3xl mx-auto">
          <div className="flex mb-16 items-center">
            <p className="text-4xl font-bold text-[#020a5a] mr-2">語彙 Quiz</p>
            <GeminiSvg className="w-7 h-7" />
          </div>
          <div className="ml-2">
            <LevelSelect />
            <Button
              as={Link}
              href="/moji/quiz"
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
