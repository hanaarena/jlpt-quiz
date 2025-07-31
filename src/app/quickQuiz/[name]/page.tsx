import { Suspense } from "react";
import Container from "./container";
import { ChatTypeValue } from "@/app/utils/const";
import ContainerV2 from "./containerV2";

export async function generateStaticParams() {
  const names = [ChatTypeValue.Moji1Quick, ChatTypeValue.Moji5Quick, ChatTypeValue.Dokkai1, ChatTypeValue.Moji3Quick];

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
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {
          name === ChatTypeValue.Moji3Quick ? <ContainerV2 /> : <Container quizName={name} />
        }
      </Suspense>
    </>
  );
}
