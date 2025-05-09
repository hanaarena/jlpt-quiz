import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  CoreAssistantMessage,
  CoreSystemMessage,
  CoreToolMessage,
  CoreUserMessage,
  generateText,
  streamText,
} from "ai";
import { systemMessage } from "../utils/const";

import type { ChatType } from "../utils/const";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

/**
 *
 * @param object { content, chatType}
 * @returns
 * @description https://sdk.vercel.ai/examples/next-app/basics/streaming-text-generation
 */
// export async function streamGenerateGemini({
//   content,
//   chatType,
// }: {
//   content: string;
//   chatType: ChatType;
// }) {
//   const stream = createStreamableValue("");
//   (async () => {
//     try {
//       const { textStream, fullStream } = await streamText({
//         model: google.chat("models/gemini-1.5-flash"),
//         temperature: 1,
//         system: systemMessage[chatType].prompt,
//         // messages: [...history]
//         messages: [
//           {
//             role: "user",
//             content,
//           },
//         ],
//       });

//       for await (const delta of textStream) {
//         stream.update(delta);
//       }

//       stream.done();
//     } catch (e) {
//       console.error(e);

//       return new Error("The AI got rate limited, please try again later.");
//     }
//   })();

//   return { output: stream.value };
// }

export async function streamGenerateGemini2({
  content,
  chatType,
}: {
  content: string;
  chatType: ChatType;
}) {
  try {
    const result = await streamText({
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

    let textContent = "";
    for await (const delta of result.fullStream) {
      const { type } = delta;
      if (type === "text-delta") {
        const { textDelta } = delta;
        textContent += textDelta;
      } else if (type === "finish") {
        console.warn("kekeke finish textContent", textContent);
      }
    }
  } catch (e) {
    console.error(e);

    return new Error("The AI got rate limited, please try again later.");
  }
}

/**
 *
 * @param options { content, chatType}
 * @returns
 * @description 可直接传入`prompt`作为生成内容提示句。或者传入`messages`作为历史消息(`history`)
 * @tutorial https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-text#parameters
 */
export async function generateGemini({
  content,
  chatType,
  prompt,
  messages,
  model
}: {
  content: string;
  chatType?: ChatType;
  prompt?: string;
  messages?: Array<
    CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage
  >;
  model?: "gemini-1.5-flash-latest" | "models/gemini-2.0-flash-exp" | string
}) {
  try {
    // return example:
    // {
    //   "text": "词汇： かいさん (解散)\n\n考题：  \n会議は午後３時に＿＿＿＿。  \n选项：  \nA. 解散  \nB. 解散する  \nC. 解散した  \nD. 解散される  \n\n解释：  \n这道题考察的是「かいさん」的动词形式，表示“解散”的意思。 \n\n正确答案： C. 解散した  \n\n这句话的意思是： 会议在下午三点解散。  \n\n其他选项的解释：  \nA. 解散：原形，表示现在时或命令式。  \nB. 解散する：动词原形，表示将来时或一般现在时。\nD. 解散される：表示被动语态，与句意不符。 \n"
    // }
    const result = await generateText({
      model: google.chat(model || "models/gemini-2.0-flash-exp"),
      abortSignal: AbortSignal.timeout(10000),
      temperature: 1,
      ...(chatType ? { system: systemMessage[chatType].prompt } : {}),
      messages: messages || [
        {
          role: "user",
          content,
        },
      ],
      ...(prompt ? { prompt } : {}),
    });
    return result;
  } catch (e) {
    console.error(e);

    if (e instanceof Error) {
      return Promise.reject(e.message);
    }
    return Promise.reject(
      new Error("The AI got rate limited, please try again later.")
    );
  }
}
