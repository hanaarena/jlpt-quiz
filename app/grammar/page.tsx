"use client";
import { useEffect, useState } from "react";

import {
  getRandomGrammar,
  type TGrammar,
  type GrammarLevelType,
} from "../data/grammar";
import { generateGemini } from "../actions/gemeni";
import { cn } from "@/lib/utils";
import style from "./page.module.css";
import { shuffleArray } from "../utils/fns";
import LoadingPage from "./loading";

const COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-red-800",
  "bg-indigo-900",
];

export default function Grammar() {
  const [question, setQuestion] = useState<TGrammar & { q: string }>(
    {} as TGrammar & { q: string }
  );
  const [grammarLevel, setGrammarLevel] = useState<GrammarLevelType>(
    "" as GrammarLevelType
  );
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [loadingOption, setLoadingOption] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [answerTip, setAnswerTip] = useState({
    fullCentence: "",
    translate: "",
  });

  useEffect(() => {
    if (grammarLevel) {
      getQuestion(grammarLevel);
    }
  }, [grammarLevel]);

  const getQuestion = (level: GrammarLevelType) => {
    const grammar = getRandomGrammar(level);
    console.warn("kekek grammar", grammar);
    // pick random example
    const index = Math.floor(Math.random() * grammar.examples.length);
    const exampleArr = grammar.examples[index];
    // example format: '髪を染め<span class="bold">たい</span>';
    const example = exampleArr[0];
    // hide & pick the answer from question
    const extractedContent = example.match(/<span[^>]*>(.*?)<\/span>/g) || [];
    // content inside span: たい
    const _answerText = extractedContent
      .map((span) => span.replace(/<\/?span[^>]*>/g, ""))
      .join("");
    // q format: '髪を染め____';
    const q = example.replace(/<span[^>]*>(.*?)<\/span>/g, "____");

    setAnswerTip({
      translate: [exampleArr[1], exampleArr[2]].join("<br>"),
      fullCentence: example,
    });
    grammar.grammar = grammar.grammar
      .split("\n")
      .map((t) => t.trim())
      .join("<br>");
    grammar.meaning = grammar.meaning
      .split("\n")
      .map((t) => t.trim())
      .join("、");
    setQuestion({ ...grammar, q });
    setAnswer(_answerText);
    setShowAnswer(false);
    // generate options
    setLoadingOption(true);
    generateGemini({
      content: _answerText,
      chatType: "grammar",
    }).then((res) => {
      console.warn("kekek res", res.text);
      let o = res.text
        .split("\n")
        .map((item) => item.replace(/\*|-|\.|\d+/g, "").trim());
      o = shuffleArray([...o.slice(0, 3), _answerText]);
      setOptions(o);
      setLoadingOption(false);
    });
  };

  const handleSubmit = () => {
    if (showAnswer) {
      setOptions([]);
      getQuestion(grammarLevel);
    } else {
      setShowAnswer(true);

      // todo: juudge answer
    }
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
      <div className="g-header">{question.q}</div>
      <div className="g-content relative min-h-20">
        {loadingOption ? <LoadingPage /> : options}
      </div>
      <div className="g-footer">
        <div className="btn-submit" onClick={handleSubmit}>
          {showAnswer ? "Next" : "Submit"}
        </div>
        {showAnswer && (
          <div className="answer-tip">
            语法：
            <p
              dangerouslySetInnerHTML={{
                __html: question.grammar,
              }}
            ></p>
            解释:{" "}
            <p
              dangerouslySetInnerHTML={{
                __html: question.meaning,
              }}
            ></p>
            完整翻译：
            <p dangerouslySetInnerHTML={{ __html: answerTip.fullCentence }}></p>
            <p dangerouslySetInnerHTML={{ __html: answerTip.translate }}></p>
          </div>
        )}
      </div>
    </div>
  );
}
