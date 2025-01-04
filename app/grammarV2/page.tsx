"use client";

import { useState } from "react";
import { useAnimate } from "framer-motion";
import {
  Button,
  Divider,
  Navbar,
  NavbarContent,
  NavbarItem,
  Spacer,
} from "@nextui-org/react";

import { cn } from "@/lib/utils";
import style from "./page.module.css";

import {
  getRandomGrammarV2ByCount,
  type GrammarLevelTypeV2,
  type TGrammarV2,
} from "@/app/data/grammarV2/index";
import EmblaCarousel from "../components/EmblaCarousel";
import GrammarV2DetailCard from "./card";

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
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState(1);

  const handleChangeStage = (_stage: ESTAGE) => {
    setStage(_stage);
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
      // pick & parse answer from the example
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
    <div className={cn(style.default_bg, "h-full")}>
      {stage === "start" && (
        <div className={cn("flex flex-col items-center py-8 h-screen")}>
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
        <div className="stage-review">
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
              <NavbarItem className="bold text-2xl">
                <div className="flex items-center">
                  {currentGrammarIndex} / {grammarList.length}
                  <Button
                    className="ml-2"
                    color="primary"
                    variant="shadow"
                    size="sm"
                    onPress={() => handleChangeStage(ESTAGE.TESTING)}
                  >
                    Start
                  </Button>
                </div>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <EmblaCarousel
            className="px-4 py-2"
            options={{ loop: true }}
            onSelect={(index) => setCurrentGrammarIndex(index + 1)}
            control={{
              className:
                "fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-x-20",
              next: (
                <div className="relative">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                  <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                    Next
                  </span>
                </div>
              ),
              prev: (
                <div className="relative">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                  <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                    Prev
                  </span>
                </div>
              ),
            }}
          >
            {grammarList.map((g) => (
              <div
                key={`slide-${g.originalKey}`}
                className="embla__slide mb-12"
              >
                <p className={cn("text-[#d36f32]", "text-4xl mb-6")}>
                  {g.originalKey}
                </p>
                {g.grammar && (
                  <GrammarV2DetailCard title={"Grammar"} content={g.grammar} />
                )}
                {g.meaning && <Spacer y={4} />}
                {g.meaning && (
                  <GrammarV2DetailCard title={"Meaning"} content={g.meaning} />
                )}
                {g.english_meaning && <Spacer y={4} />}
                {g.english_meaning && (
                  <GrammarV2DetailCard
                    title={"English Meaning"}
                    content={g.english_meaning}
                  />
                )}
                {g.examples && <Spacer y={4} />}
                {g.examples && (
                  <GrammarV2DetailCard
                    className="max-h-96 overflow-y-auto"
                    title={"Examples"}
                  >
                    {g.examples.map((e, i) => (
                      <div
                        key={`exp-${i}`}
                        className={cn(
                          "flex flex-col w-full rounded-lg border px-4 py-2 mb-2",
                          "last:mb-0 border-yellow-500 bg-yellow-500 bg-opacity-10"
                        )}
                      >
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[0],
                          }}
                        />
                        <Divider className="my-2" />
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[1],
                          }}
                        />
                      </div>
                    ))}
                  </GrammarV2DetailCard>
                )}
              </div>
            ))}
          </EmblaCarousel>
        </div>
      )}
    </div>
  );
}
