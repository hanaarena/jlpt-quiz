"use client";

import RandomButton from "../randomButton";
import { useMemo, useState } from "react";
import { generateGemini } from "@/app/actions/gemeni";
import { questionKeywordAtom, questionTypeAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";
import { randomDooshiKana } from "@/app/data";
import { ChatTypeValue } from "@/app/utils/const";
import Markdown from "react-markdown";
import Loading from "../loading";

export default function Dooshi() {
  const [generation, setGeneration] = useState<{ text: string }>({ text: "" });
  const [isLoading, setLoading] = useState(false);
  const questionType = useAtomValue(questionTypeAtom);
  const [keyword, setKeyword] = useAtom(questionKeywordAtom);

  const generate = async ({ content }) => {
    setKeyword(content);
    setLoading(true);
    await fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({
        content,
        chatType: ChatTypeValue.N2Dooshi,
      }),
    }).then((response) => {
      response.json().then((json) => {
        console.warn("kekek json", json);
        setGeneration(json);
        setLoading(false);
      });
    });
  };

  useMemo(() => {
    if (questionType === 1) {
      const d = randomDooshiKana();
      const { kana, kanji } = d;
      const v = `${kana}${kanji ? `(${kanji})` : ""}`;
      generate({ content: v });
    }
  }, [questionType]);

  return (
    <div className="question-dooshi flex items-start">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <RandomButton text="再来一题" />
          <div className="content-wrapper text-black ml-12">
            <div className="question">题目：{keyword}</div>
            <div className="answer">
              答案：
              <Markdown>{generation.text}</Markdown>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
