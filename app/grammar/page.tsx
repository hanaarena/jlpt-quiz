"use client";
import { useCallback, useEffect, useState } from "react";

import {
  getRandomGrammar,
  type TGrammar,
  type GrammarLevelType,
} from "../data/grammar";
import { generateGemini } from "../actions/gemeni";
import { cn } from "@/lib/utils";
import style from "./page.module.css";

const COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-red-800",
  "bg-indigo-900",
];

export default function Grammar() {
  const [question, setQuestion] = useState<TGrammar>({} as TGrammar);
  const [grammarLevel, setGrammarLevel] = useState<GrammarLevelType>(
    "" as GrammarLevelType
  );
  const [answer, setAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (grammarLevel) {
      getQuestion(grammarLevel);
    }
  }, [grammarLevel]);

  const getQuestion = (level: GrammarLevelType) => {
    const grammar = getRandomGrammar(level);
    console.warn("kekek grammar", grammar);
    const index = Math.floor(Math.random() * grammar.examples.length);
    const example = grammar.examples[index];
    console.warn("kekek example", example);
    // todo: hide & pick the answer from question
    setQuestion(grammar);
    setAnswer("");
    setShowAnswer(false);
  };

  const getOptions = () => {
    generateGemini({
      content: question.grammar,
      prompt: question.grammar,
      messages: [
        {
          role: "user",
          content:
            "给定一个日语词汇，随机生成与之无关的语法词汇或短语，请直接输出结果（4个选项即可），不带其他介绍性的句子：\nてくれ",
        },
        {
          role: "system",
          content: "1. だろう\n2. から\n3. ことにする\n4. ように",
        },
      ],
    });
    setOptions([]);
  };

  const handleSubmit = () => {
    setShowAnswer(true);
  };

  return (
    <div>
      <div
        className={cn(
          "selection fixed w-full h-dvh bg-white flex justify-center items-center",
          "flex-col",
          grammarLevel ? style.selection_active : ""
        )}
      >
        {["n5", "n4", "n3", "n2"].map((level, index) => (
          <div
            key={level}
            className={cn(
              "btn-level w-20 h-20 rounded-full",
              "text-white text-center text-3xl leading-[5rem]",
              "font-bold mb-4 last:mb-0",
              COLORS[index],
              grammarLevel === level ? style.level_active : ""
            )}
            onClick={() => setGrammarLevel(level as GrammarLevelType)}
          >
            {level}
          </div>
        ))}
      </div>
      <div className="g-header"></div>
      <div className="g-content"></div>
      <div className="g-footer">
        <div className="btn-submit">Submit</div>
      </div>
    </div>
  );
}
