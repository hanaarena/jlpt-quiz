import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { systemMessage } from "../utils/const";
import { createStreamableValue } from "ai/rsc";

import type { ChatType } from "../utils/const";

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyDQq6_GaGvvLS09DxrCRJA8VnwwG8xnc2Q",
});

/**
 *
 * @param object { content, chatType}
 * @returns
 * @description https://sdk.vercel.ai/examples/next-app/basics/streaming-text-generation
 */
export async function streamGenerateGemini({
  content,
  chatType,
}: {
  content: string;
  chatType: ChatType;
}) {
  const stream = createStreamableValue("");
  (async () => {
    try {
      const { textStream, fullStream } = await streamText({
        model: google.chat("models/gemini-1.5-flash"),
        temperature: 1,
        system: systemMessage[chatType].prompt,
        // messages: [...history]
        messages: [
          {
            role: "user",
            content,
          },
        ],
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    } catch (e) {
      console.error(e);

      return new Error("The AI got rate limited, please try again later.");
    }
  })();

  return { output: stream.value };
}

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

export async function generateGemini({
  content,
  chatType,
}: {
  content: string;
  chatType: ChatType;
}) {
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
    return result;
  } catch (e) {
    console.error(e);

    return Promise.reject(
      new Error("The AI got rate limited, please try again later.")
    );
  }
}
