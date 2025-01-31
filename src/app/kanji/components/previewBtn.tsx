"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function PreviewBtn() {
  const router = useRouter();

  return (
    <Button
      color="primary"
      variant="shadow"
      className="text-xl w-28"
      onPress={() => router.push("/kanji/preview")}
    >
      Start
    </Button>
  );
}
