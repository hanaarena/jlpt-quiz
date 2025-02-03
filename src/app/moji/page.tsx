import { Button } from "@heroui/button";
import LevelSelect from "./components/levelSelect";
import MojiHeader from "./header";
import Link from "next/link";
import GeminiSvg from "@/app/components/icons/gemini";
import BackHomeLink from "../components/backHomeLink";

export default function MojiPage() {
  return (
    <div>
      <BackHomeLink className="-mt-3" />
      <MojiHeader />
      <main className="-mt-6 px-7 max-w-3xl mx-auto">
        <div className="flex mb-16">
          <p className="text-4xl font-bold text-[#020a5a] mr-2">語彙 Quiz</p>
          <GeminiSvg className="w-10 h-10" />
        </div>
        <div className="ml-2">
          <LevelSelect />
          <Button
            as={Link}
            href="/moji/quiz"
            color="primary"
            variant="shadow"
            className="mt-2"
          >
            Start
          </Button>
        </div>
      </main>
    </div>
  );
}
