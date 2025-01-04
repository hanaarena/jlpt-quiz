"use client";

import { useState } from "react";
import { useAnimate } from "framer-motion";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";

import { cn } from "@/lib/utils";
import style from "./page.module.css";

import {
  getRandomGrammarV2ByCount,
  type GrammarLevelTypeV2,
  type TGrammarV2,
} from "@/app/data/grammarV2/index";

const LEVEL = {
  n1: "N1",
  n2: "N2",
  n3: "N3",
  n4: "N4",
  n5: "N5",
};

enum ESTAGE {
  START = "start",
  REVIEW = "review",
  TESTING = "testing",
  END = "end",
}

interface IQuiz {
  key: string | undefined;
  grammar: string | undefined;
  meaning: string | undefined;
  sentence: string;
  translation: string;
  answer: string;
}

export default function GrammarV2() {
  const [stage, setStage] = useState<ESTAGE>(ESTAGE.START);
  const [scope, animate] = useAnimate();
  const [currentLevel, setCurrentLevel] = useState<GrammarLevelTypeV2>("n5");
  const [grammarList, setGrammarList] = useState<TGrammarV2[]>([]);
  const [quizList, setQuizList] = useState<IQuiz[]>([]);
  const [wrongList, setWrongList] = useState<IQuiz[]>([]);

  const handleChangeStage = (_stage: ESTAGE) => {
    setStage(_stage);
  };

  const findGrammarIndex = (grammar: TGrammarV2) => {
    return grammarList.findIndex((item) => item.grammar === grammar.grammar);
  };

  const getGrammarList = () => {
    const list = getRandomGrammarV2ByCount(currentLevel, 5);
    setGrammarList(list);
    getQuizSentences(list);
  };

  const getQuizSentences = (_grammarList: TGrammarV2[]) => {
    const list: IQuiz[] = [];
    _grammarList.forEach((g) => {
      // shuffle the examples and pick two of them
      const examples = g.examples.sort(() => Math.random() - 0.5);
      const randomExamples = examples.slice(0, 2);
      const regex =
        /(<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong>|<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong><span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?">)([^<]+)(<\/span><\/strong><\/span>|<\/strong><\/span>)/gm;
      // pick answer from the example
      randomExamples.forEach((e) => {
        regex.lastIndex = 0;
        let ans = "";
        let sentence = e[0];
        let replaceStr = "";
        let m;

        while ((m = regex.exec(sentence)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          m.forEach((match, groupIndex) => {
            if (groupIndex === 2) {
              ans = match;
            } else if (groupIndex === 0) {
              replaceStr = match;
            }
          });
        }
        sentence = sentence.replace(replaceStr, Array(ans.length).join("_"));

        list.push({
          key: g.originalKey || ans,
          grammar: g.grammar || g.originalKey,
          meaning: g.meaning,
          sentence,
          translation: e[1],
          answer: ans,
        });
      });
    });

    setQuizList(list);
  };

  return (
    <div className={cn(style.default_bg, "h-screen")}>
      {stage === "start" && (
        <div className={cn("flex flex-col items-center py-8")}>
          <p className={cn("text-2xl bold mb-12", style.title_color)}>
            Select JLPT Level
          </p>
          <div
            ref={scope}
            className="level-circles w-7/12 flex justify-center flex-wrap gap-x-4 gap-y-8"
          >
            {Object.entries(LEVEL).map(([key, value], index) => (
              <div
                key={`level-${key}`}
                className={cn(
                  "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
                  "relative border bold",
                  style.title_color,
                  style.icon_bg,
                  style.icon_border
                )}
                onClick={() => {
                  setCurrentLevel(key as GrammarLevelTypeV2);
                  getGrammarList();
                  animate(
                    scope.current.children[index],
                    {
                      scale: [1, 0.6, 22],
                      zIndex: 10,
                    },
                    {
                      duration: 0.5,
                      ease: "circInOut",
                    }
                  );
                  // after animation end
                  setTimeout(() => {
                    handleChangeStage(ESTAGE.REVIEW);
                  }, 600);
                }}
              >
                <p className="relative">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {stage === "review" && (
        <div>
          <Navbar classNames={{ base: "bg-[#fdedd3] py-4" }}>
            <NavbarContent justify="start">
              <NavbarItem>
                <div
                  className={cn(
                    "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
                    "relative border bold",
                    style.title_color,
                    style.icon_bg,
                    style.icon_border
                  )}
                >
                  {currentLevel.toUpperCase()}
                </div>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem>1 / 5</NavbarItem>
            </NavbarContent>
          </Navbar>
        </div>
      )}
    </div>
  );
}
