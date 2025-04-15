import Container from "./container";

export async function generateStaticParams() {
  const names = ["moji_1"];

  return names.map((name) => ({
    name: name,
  }));
}

export default async function QuickQuizWrapper({
  params,
}: {
  params: { name: string };
}) {
  const { name } = await params;

  return <Container quizName={name} />;
}
