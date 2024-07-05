import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { ChatType, systemMessage } from '@/app/utils/const';

export async function POST(req: Request) {
  const { content, chatType }: { content: string, chatType: ChatType } = await req.json();

  try {
    const result = await generateText({
      model: google.chat("models/gemini-1.5-flash"),
      temperature: 1,
      system: systemMessage[chatType].prompt,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });
    const res = {...result}

    if (res && res.text) {
      // todo: replace 「\n」 with 「  \n」
      res.text = res.text.replace(/\n/g, "  \n")
    }
    return Response.json(res);
  } catch (e) {
    console.error(e);

    return new Error("The AI got rate limited, please try again later.");
  }

}