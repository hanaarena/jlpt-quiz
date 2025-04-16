import Container from "./container";

export async function generateStaticParams() {
  const names = ["moji_1"];

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

  return <Container quizName={name} />;
}
