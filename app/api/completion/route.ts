export const dynamic = "force-dynamic"; // defaults to auto
export const runtime = "edge";
import { ChatType } from "@/app/utils/const";
import { generateGemini } from "@/app/actions/gemeni";
import { NextApiResponse } from "next";
import { handleDooshiOutput } from "@/app/actions/quizGenerationParse";

export async function POST(req: Request, resp: NextApiResponse) {
  const { content, chatType }: { content: string; chatType: ChatType } =
    await req.json();

  const result = await generateGemini({ content, chatType });
  const res = { ...result };
  let questionObj = {};

  // detect res is not typeof Error
  if (res instanceof Error) {
    return resp
      .status(500)
      .send({ error: res.message || "failed to fetch data" });
    // return Response.json({ error: res.message})
  } else if (res.text) {
    res.text = res.text.replace(/\n/g, "  \n");
    questionObj = await handleDooshiOutput(res.text);
  }
  return Response.json(Object.assign({}, res, questionObj));
}
