"use client";

import { useState } from "react";
import {
  Button,
  Divider,
  Navbar,
  NavbarContent,
  NavbarItem,
  Spacer
} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import {
  getRandomGrammarV2ByCount,
  type GrammarLevelTypeV2,
  type TGrammarV2
} from "@/app/data/grammarV2/index";
import EmblaCarousel from "../components/EmblaCarousel";
import GrammarV2DetailCard from "./card";
import { generateGemini } from "../actions/gemeni";
import { cheerful, shuffleArray } from "../utils/fns";
import { atom, useAtom } from "jotai";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import StageStart from "./stageStart";
import StageTesting from "./stageTesting";

import style from "./page.module.css";
import StageResult from "./stageResult";
import { datasetAtom } from "./atom";
import { parseAnswer } from "../data/grammar";

enum ESTAGE {
  START = "start",
  REVIEW = "review",
  TESTING = "testing",
  RESULT = "result"
}

export interface IQuiz {
  key: string | undefined;
  grammar: string;
  meaning: string | undefined;
  sentence: string;
  english_meaning: string;
  answer: string;
  examples: string[][];
}

export type TCurrentQuiz = IQuiz & { selected: string };
const initQuizList = atom<IQuiz[]>([]);

export default function GrammarV2() {
  const [stage, setStage] = useState<ESTAGE>(ESTAGE.START);
  const [currentLevel, setCurrentLevel] = useState<GrammarLevelTypeV2>("n5");
  const [grammarList, setGrammarList] = useState<TGrammarV2[]>([]);
  const [quizList, setQuizList] = useAtom(initQuizList);
  const [wrongList, setWrongList] = useState<TCurrentQuiz[]>([]);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<TCurrentQuiz>(
    {} as TCurrentQuiz
  );
  const [dataset, setDataset] = useAtom(datasetAtom);

  const handleChangeStage = (_stage: ESTAGE) => {
    switch (_stage) {
      case ESTAGE.REVIEW:
        setCurrentGrammarIndex(0);
        getGrammarList();
        break;
      case ESTAGE.TESTING:
        setCurrentGrammarIndex(0);
        pickQuiz(0);
        break;
    }
    setStage(_stage);
  };

  const getGrammarList = () => {
    const list = getRandomGrammarV2ByCount(currentLevel, 5, dataset);
    setGrammarList(list);
    generateQuizList(list);
  };

  const generateQuizList = (_grammarList: TGrammarV2[]) => {
    let list: IQuiz[] = [];
    console.warn("kekek _grammarList", _grammarList);
    _grammarList.forEach((g) => {
      // shuffle the examples and pick two of them
      const examples = shuffleArray(g.examples);
      const randomExamples = examples.slice(0, 2);
      const regex =
        /(<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong>|<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong\sstyle=\\?"[a-zA-Z-]+\s*:\s*[^;]+;\\">|<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong><span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?">|<strong><span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?">|<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong><span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?">)([^<]+)(<\/span><\/strong><\/?span(\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?")?>|<\/strong><\/span>|<\/span><\/strong>|<\/span><\/span><\/strong><\/span>)/gm;
      // pick & parse answer from the example
      randomExamples.forEach((e) => {
        let ans = "";
        let sentence = "";

        if (dataset === "v1") {
          parseAnswer(g, e);
        } else if (dataset === "v2") {
          regex.lastIndex = 0;
          let replaceStr = "";
          let m;
          sentence = e[0];

          while ((m = regex.exec(sentence)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
              if (groupIndex === 2) {
                ans += match;
              } else if (groupIndex === 0) {
                replaceStr = match;
              }
            });
          }
          sentence = sentence.replace(replaceStr, Array(ans.length).join("__"));
        }

        list.push({
          key: g.originalKey || ans,
          grammar: g.grammar || g.originalKey,
          meaning: g.meaning,
          sentence,
          english_meaning: e[1],
          answer: ans,
          examples: randomExamples
        });
      });
    });

    console.warn("kekek list", list);
    list = shuffleArray(list);
    setQuizList(list);
  };

  const pickQuiz = (index: number) => {
    const quiz = quizList[index];
    setCurrentQuiz({ ...quiz, selected: "" });
    generateQuizOptions(quiz, index);
  };

  async function wrapMutation(quiz: IQuiz) {
    return generateGemini({
      content: quiz.answer,
      chatType: "grammar"
    });
  }

  const { mutate } = useMutation({
    mutationFn: wrapMutation,
    onSuccess: (res, varaiables) => {
      let o = res.text
        .split("\n")
        .map((item) => item.replace(/\*|-|\.|\d+/g, "").trim());
      o = shuffleArray([...o.slice(0, 3), varaiables.answer]);
      setQuizOptions(o);
    },
    onError: (err) => {
      toast.error("Get Options failed: " + err, { duration: 2000 });
    },
    retryDelay: 1000,
    retry: 3
  });

  const generateQuizOptions = async (quiz: IQuiz, index: number) => {
    if (!quiz.answer) {
      toast.error("question parsed faiiled! skipping to next...", {
        duration: 2000
      });
      await new Promise((resolve) => setTimeout(resolve, 2100));
      handleNextQuiz(index);
      return;
    }
    setQuizOptions([]);
    mutate(quiz);
  };

  const handleQuizSubmit = (selectedAns: string, _: number) => {
    const _currentQuiz = { ...currentQuiz, selected: selectedAns };
    setCurrentQuiz(_currentQuiz);
    const isCorrect = currentQuiz.answer === selectedAns;
    if (isCorrect) {
      cheerful();
    } else {
      setWrongList((prev) => [...prev, _currentQuiz]);
    }
  };

  const handleNextQuiz = (newIndex?: number) => {
    const idx = Number.isInteger(newIndex)
      ? Number(newIndex)
      : currentGrammarIndex;
    if (idx < quizList.length - 1) {
      let nextIndex = idx + 1;
      setCurrentGrammarIndex(nextIndex);
      pickQuiz(nextIndex);
    } else {
      handleChangeStage(ESTAGE.RESULT);
    }
  };

  const startNewQuiz = () => {
    setWrongList([]);
    getGrammarList();
    handleChangeStage(ESTAGE.REVIEW);
  };

  return (
    <div className={cn(style.default_bg, "h-full")}>
      <Toaster />
      {stage === ESTAGE.START && (
        <StageStart
          onClick={(level) => {
            setCurrentLevel(level);
            setTimeout(() => {
              handleChangeStage(ESTAGE.REVIEW);
            }, 820);
          }}
        />
      )}
      {stage === ESTAGE.REVIEW && (
        <div
          className={cn("stage-review", style.default_bg_img, "min-h-screen")}
        >
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
              <NavbarItem>
                <div className="flex items-center flex-col">
                  <p className="bold text-2xl mb-2">
                    {currentGrammarIndex + 1} / {grammarList.length}
                  </p>
                  <Button
                    className={cn("ml-2 bg-[#e36f23] text-white")}
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
            onSelect={(index) => {
              setCurrentGrammarIndex(index);
              window.scrollTo({ top: 0 });
            }}
            control={{
              className:
                "fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-x-20",
              next: (
                <div className="relative w-24 text-center">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
                  <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                    Next
                  </span>
                </div>
              ),
              prev: (
                <div className="relative w-24 text-center">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
                  <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                    Prev
                  </span>
                </div>
              )
            }}
          >
            {grammarList.map((g) => (
              <div
                key={`slide-${g.originalKey}`}
                className="embla__slide mb-12"
              >
                <p className={cn("text-[#d36f32]", "text-4xl mt-3 mb-4")}>
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
                            __html: e[0]
                          }}
                        />
                        <Divider className="my-2" />
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[1]
                          }}
                        />
                        {/* compatible with v1 data which have third translation */}
                        {e[2] && (
                          <>
                            <Divider className="my-2" />
                            <p
                              className="text-lg"
                              dangerouslySetInnerHTML={{
                                __html: e[2]
                              }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </GrammarV2DetailCard>
                )}
              </div>
            ))}
          </EmblaCarousel>
        </div>
      )}
      {stage === ESTAGE.TESTING && (
        <StageTesting
          quizList={quizList}
          currentGrammarIndex={currentGrammarIndex}
          quizOptions={quizOptions}
          currentQuiz={currentQuiz}
          handleSubmit={(ans, index) => handleQuizSubmit(ans, index)}
          handleNext={() => handleNextQuiz()}
        />
      )}
      {stage === ESTAGE.RESULT && (
        <StageResult
          quizList={quizList}
          wrongList={wrongList}
          onStart={startNewQuiz}
          level={currentLevel}
        />
      )}
    </div>
  );
}
