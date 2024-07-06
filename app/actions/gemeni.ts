"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { systemMessage } from "../utils/const";
import { createStreamableValue } from "ai/rsc";

import type { ChatType } from "../utils/const";

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyDQq6_GaGvvLS09DxrCRJA8VnwwG8xnc2Q",
});

console.warn(
  "kekeke process.env.GOOGLE_GENERATIVE_AI_API_KEY",
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
);

/**
 * 处理動詞题目生成的答案
 * @param content {string}
 */
export async function handleDooshiOutput(content: string) {
  if (content.length < 20) {
    return { error: "generate too short" };
  }
  let questionTitle = "";
  let questionOptionsText = "";
  let questionOptions: string[] = [];
  let questionExplanation = "";
  let questionAnswer = "";

  // match title
  const reg1 = /考题：([\s\S]+?)选项/;
  const match1 = reg1.exec(content);
  if (match1) {
    const c = match1[1].trim();
    questionTitle = c;
  }

  // match options
  const reg2 = /选项：([\s\S]+?)解释/;
  const match2 = reg2.exec(content);
  if (match2) {
    const c = match2[1].trim();
    questionOptionsText = c;
  }

  // match explanation
  const reg3 = /解释：([\s\S]+)/;
  const match3 = reg3.exec(content);
  if (match3) {
    const c = match3[1].trim();
    questionExplanation = c;
  }

  // match answer
  const reg4 = /正确答案：([\s\S]+?)这句话的意思/;
  const match4 = reg4.exec(content);
  if (match4) {
    const c = match4[1].trim();
    questionAnswer = c;
  }

  // split each options
  const reg5 = /^[A-D]\. .+/gm;
  const match5 = questionOptionsText.match(reg5);
  if (match5 && match5.length) {
    questionOptions = match5.map((o) => o.replace(/^[A-D\.] /, "").trim())
  }

  // below regex can match hirakara,katakana and kanji
  // [\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+

  return {
    questionTitle,
    questionOptions,
    questionExplanation,
    questionAnswer,
    questionOptionsText
  };
}

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
