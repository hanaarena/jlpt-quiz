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
import { cheerful, shuffleArray } from "../utils/fns";
import LoadingPage from "./loading";
import Tag from "../components/tag";

const LEVEL = {
  n0: "N0",
  n1: "N1",
  n2: "N2",
  n3: "N3",
  n4: "N4",
  n5: "N5",
};
const COLORS = {
  [LEVEL.n5]: "bg-green-500",
  [LEVEL.n4]: "bg-blue-500",
  [LEVEL.n3]: "bg-yellow-500",
  [LEVEL.n2]: "bg-red-800",
  [LEVEL.n1]: "bg-indigo-900",
  [LEVEL.n0]: "bg-black",
};

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
  const [userAnswer, setUserAnswer] = useState<string>("");

  useEffect(() => {
    if (grammarLevel) {
      getQuestion(grammarLevel);
    }
  }, [grammarLevel]);

  const getQuestion = (level: GrammarLevelType) => {
    const grammar = getRandomGrammar(level);
    // pick random example
    const index = Math.floor(Math.random() * grammar.examples.length);
    const exampleArr = grammar.examples[index];
    // example format: '髪を染め<span class="bold">たい</span>';
    const example = exampleArr[0];
    // extractContent format: ['<span class="bold">たい</span>']
    const extractedContent = example.match(/<span[^>]*>(.*?)<\/span>/g) || [];
    // pick content inside span: たい
    const _answerText = extractedContent
      .map((span) => span.replace(/<\/?span[^>]*>/g, ""))
      .join("、"); // 适配多个答案填空时
    // hide the answer from question
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
      setUserAnswer("");
      getQuestion(grammarLevel);
    } else {
      setShowAnswer(true);

      if (userAnswer === answer) {
        cheerful();
      }
    }
  };

  return (
    <div className="p-2">
      <div
        className={cn(
          "selection fixed w-full h-dvh bg-white flex justify-center items-center",
          "flex-col z-10 top-0 left-0",
          style.selection_bg,
          grammarLevel ? style.selection_active : ""
        )}
      >
        {Object.keys(LEVEL).map((level) => (
          <div
            key={level}
            className={cn(
              "btn-level w-20 h-20 rounded-full",
              "text-white text-center text-3xl leading-[5rem]",
              "font-bold -mb-2 last:mb-0",
              style[`level_bg_${level}`],
              grammarLevel === level ? style.level_active : ""
            )}
            onClick={() => setGrammarLevel(level as GrammarLevelType)}
          >
            {LEVEL[level]}
          </div>
        ))}
      </div>
      <div className="g-header">
        <div className="level-title relative font-bold text-3xl mb-4">
          {grammarLevel.toUpperCase()}
          <span
            className={cn(
              "absolute left-[4px] bottom-[4px] w-11 h-2 bg-opacity-50",
              COLORS[grammarLevel.toLocaleUpperCase()]
            )}
          ></span>
        </div>
        <p className="text-2xl mb-4">&#8226;&nbsp;{question.q}</p>
      </div>
      <div className="g-content relative min-h-20">
        {loadingOption ? (
          <LoadingPage />
        ) : (
          <div className="options mb-8">
            {options.map((item) => (
              <div
                key={item}
                className={cn(
                  "option-item border border-gray-400 rounded px-3 py-1",
                  "text-lg mb-2 last:mb-0",
                  userAnswer === item ? "bg-black text-white" : "",
                  showAnswer
                    ? item === answer
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-red-200 border-red-200 text-white"
                    : ""
                )}
                onClick={() => setUserAnswer(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="g-footer">
        <button
          className={cn(
            "rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2",
            "block m-auto text-base"
          )}
          type="button"
          onClick={handleSubmit}
        >
          {showAnswer ? "Next" : "Submit"}
        </button>
        {showAnswer && (
          <div className="answer-tip">
            <Tag tag="green">语法</Tag>
            <p
              dangerouslySetInnerHTML={{
                __html: question.grammar,
              }}
            ></p>
            <Tag tag="blue">解释</Tag>
            <p
              dangerouslySetInnerHTML={{
                __html: question.meaning,
              }}
            ></p>
            <Tag tag="yellow">完整翻译</Tag>
            <p dangerouslySetInnerHTML={{ __html: answerTip.fullCentence }}></p>
            <p
              className={style.translate}
              dangerouslySetInnerHTML={{ __html: answerTip.translate }}
            ></p>
          </div>
        )}
      </div>
    </div>
  );
}
