import { Suspense } from "react";
import Container from "./container";
import { ChatTypeValue } from "@/app/utils/const";

export async function generateStaticParams() {
  const names = [ChatTypeValue.Moji1Quick];

  return names.map((name) => ({
    name: name,
  }));
}

type Params = Promise<{ name: string }>;

export default async function QuickQuizWrapper({ params }: { params: Params }) {
  let name = "";
  if (process.env.NODE_ENV === "development") {
    const obj = await params;
    name = obj.name;
  } else {
    // @ts-expect-error campatible with static generation pre-rendering
    name = params.name;
  }

  return (
    <Suspense>
      <Container quizName={name} />
    </Suspense>
  );
}
