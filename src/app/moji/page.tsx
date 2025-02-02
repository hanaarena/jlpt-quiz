import { Button } from "@heroui/button";
import LevelSelect from "./components/levelSelect";
import MojiHeader from "./header";
import Link from "next/link";

export default function MojiPage() {
  return (
    <div>
      <MojiHeader />
      <main className="mt-48 px-7">
        <LevelSelect />
        <Button
          as={Link}
          href="/moji/quiz"
          color="primary"
          variant="shadow"
          className="mt-3"
        >
          Start
        </Button>
      </main>
    </div>
  );
}
