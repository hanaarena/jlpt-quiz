"use client";

import { ReactNode, useState } from "react";
import { useAnimate } from "framer-motion";
import {
  Button,
  CircularProgress,
  Divider,
  Navbar,
  NavbarContent,
  NavbarItem,
  Progress,
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
import { generateGemini } from "../actions/gemeni";
import { cheerful, shuffleArray } from "../utils/fns";
import { CircleCheckBig, CircleX } from "lucide-react";
import { atom, useAtom } from "jotai";
import LoadingV3 from "../components/loadingV3";
import toast, { Toaster } from "react-hot-toast";

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
  RESULT = "result",
}

export interface IQuiz {
  key: string | undefined;
  grammar: string | undefined;
  meaning: string | undefined;
  sentence: string;
  translation: string;
  answer: string;
}

type TCurrentQuiz = IQuiz & { selected: string };
const initQuizList = atom<IQuiz[]>([]);

export default function GrammarV2() {
  const [stage, setStage] = useState<ESTAGE>(ESTAGE.START);
  const [scope, animate] = useAnimate();
  const [currentLevel, setCurrentLevel] = useState<GrammarLevelTypeV2>("n5");
  const [grammarList, setGrammarList] = useState<TGrammarV2[]>([]);
  const [quizList, setQuizList] = useAtom(initQuizList);
  const [wrongList, setWrongList] = useState<IQuiz[]>([]);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<TCurrentQuiz>(
    {} as TCurrentQuiz
  );

  const handleChangeStage = (_stage: ESTAGE) => {
    switch (_stage) {
      case ESTAGE.REVIEW:
        setCurrentGrammarIndex(0);
        break;
      case ESTAGE.TESTING:
        setCurrentGrammarIndex(0);
        pickQuiz();
        break;
    }
    setStage(_stage);
  };

  const getGrammarList = () => {
    const list = getRandomGrammarV2ByCount(currentLevel, 5);
    setGrammarList(list);
    generateQuizList(list);
  };

  const generateQuizList = (_grammarList: TGrammarV2[]) => {
    let list: IQuiz[] = [];
    _grammarList.forEach((g) => {
      // shuffle the examples and pick two of them
      const examples = g.examples.sort(() => Math.random() - 0.5);
      const randomExamples = examples.slice(0, 2);
      const regex =
        /(<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong>|<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong\sstyle=\\?"[a-zA-Z-]+\s*:\s*[^;]+;\\">|<span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?"><strong><span\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?">)([^<]+)(<\/span><\/strong><\/?span(\sstyle=\\?"color:\s#[a-fA-F0-9]{6};\\?")?>|<\/strong><\/span>)/gm;
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
              ans += match;
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

    list = shuffleArray(list);
    setQuizList(list);
  };

  const pickQuiz = () => {
    const quiz = quizList[currentGrammarIndex];
    setCurrentQuiz({ ...quiz, selected: "" });
    generateQuizOptions(quiz);
  };

  const generateQuizOptions = async (quiz: IQuiz) => {
    if (!quiz.answer) {
      console.error("No answer found for quiz: ", quiz);
      toast.error("question parsed faiiled! skip to next", {
        duration: 2000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2100));
      handleNextQuiz();
      return;
    }
    setQuizOptions([]);
    generateGemini({
      content: quiz.answer,
      chatType: "grammar",
    }).then((res) => {
      let o = res.text
        .split("\n")
        .map((item) => item.replace(/\*|-|\.|\d+/g, "").trim());
      o = shuffleArray([...o.slice(0, 3), quiz.answer]);
      setQuizOptions(o);
    });
  };

  const handleQuizSubmit = (selectedAns: string, optionIndex: number) => {
    setCurrentQuiz((prev) => ({ ...prev, selected: selectedAns }));
    const isCorrect = currentQuiz.answer === selectedAns;
    if (isCorrect) {
      cheerful();
    } else {
      animate(
        scope.current?.children[optionIndex],
        {
          rotate: [0, 15, -15, 15, -15, 0],
          transition: { type: "spring", stiffness: 300, damping: 100 },
        },
        { duration: 0.4 }
      );
      setWrongList((prev) => [...prev, currentQuiz]);
    }
  };

  const handleNextQuiz = () => {
    if (currentGrammarIndex < quizList.length - 1) {
      setCurrentGrammarIndex((prev) => prev + 1);
      pickQuiz();
    } else {
      handleChangeStage(ESTAGE.RESULT);
    }
  };

  const detectOptionStyle = (option: string) => {
    let obj = { style: "", icon: null as ReactNode };
    const isCorrect =
      currentQuiz.selected === option &&
      currentQuiz.selected === currentQuiz.answer;
    const isWrong =
      currentQuiz.selected === option && currentQuiz.answer !== option;

    if (isCorrect) {
      obj.style = "!bg-green-600 [&>p]:!text-white !border-green-600";
      obj.icon = <CircleCheckBig color="white" />;
    } else if (isWrong) {
      obj.style = "!bg-red-600 [&>p]:!text-white !border-red-600";
      obj.icon = <CircleX color="white" />;
    }

    return obj;
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
                      opacity: [1, 0.75],
                      zIndex: 10,
                    },
                    {
                      duration: 0.5,
                      ease: "circInOut",
                    }
                  );
                  setTimeout(() => {
                    handleChangeStage(ESTAGE.REVIEW);
                  }, 410);
                }}
              >
                <p className="relative">{value}</p>
              </div>
            ))}
          </div>
        </div>
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
            onSelect={(index) => setCurrentGrammarIndex(index)}
            control={{
              className:
                "fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-x-20",
              next: (
                <div className="relative">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
                  <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
                    Next
                  </span>
                </div>
              ),
              prev: (
                <div className="relative">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-[#e36f23]"></span>
                  <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-[#e36f23] bg-white px-3 py-1 text-base font-bold text-black transition duration-100">
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
      {stage === ESTAGE.TESTING && (
        <div
          className={cn(
            "min-h-screen flex flex-col items-center px-8",
            style.default_bg_img,
            "!bg-[#faf5ef]/[0.85]"
          )}
        >
          <div className={cn(style.title_color, "bold text-2xl mt-6 mb-4")}>
            {currentGrammarIndex + 1} / {quizList.length}
          </div>
          <Progress
            aria-label="Loading..."
            className="mb-12"
            color="warning"
            value={Number(
              (((currentGrammarIndex + 1) / quizList.length) * 100).toFixed(0)
            )}
          />
          <p
            className={cn("text-2xl mb-8", style.title_color)}
            dangerouslySetInnerHTML={{ __html: currentQuiz.sentence }}
          />
          {quizOptions.length > 1 ? (
            <>
              <div className="options mb-8" ref={scope}>
                {quizOptions.map((option, index) => (
                  <Button
                    key={`option-${index}`}
                    className={cn(
                      "w-full mb-5 border-2 rounded-sm",
                      "h-16 last:mb-0 outline-none",
                      style.icon_bg,
                      style.icon_border,
                      detectOptionStyle(option).style
                    )}
                    variant="shadow"
                    startContent={detectOptionStyle(option).icon}
                    onPress={() => handleQuizSubmit(option, index)}
                  >
                    <p className={cn(style.card_title, "text-xl")}>{option}</p>
                  </Button>
                ))}
              </div>
              <Button
                className={cn("bg-[#e36f23] text-white text-lg")}
                onPress={handleNextQuiz}
              >
                Next
              </Button>
            </>
          ) : (
            <LoadingV3 />
          )}
        </div>
      )}
      {stage === ESTAGE.RESULT && (
        <div className="stage-result flex flex-col items-center px-6 min-h-screen">
          <div className={cn(style.title_color, "text-4xl bold mt-4 mb-4")}>
            Score
          </div>
          {/* Circle progress bar here */}
          <CircularProgress
            aria-label="score-progress"
            classNames={{
              base: "mb-8",
              svg: "w-40 h-40 drop-shadow-md",
              value: "text-3xl font-semibold text-yellow-500",
            }}
            color="warning"
            showValueLabel={true}
            strokeWidth={4}
            value={Number(
              (
                ((quizList.length - wrongList.length) / quizList.length) *
                100
              ).toFixed(0)
            )}
          />
          {/* TODO: show time spent here */}
          <p className={cn(style.title_color, "text-sm mb-4")}>
            Wrong questions(click to check detail):
          </p>
          {wrongList.map(
            (w, index) =>
              w.grammar && (
                <GrammarV2DetailCard
                  key={`wrong-${index}-${w.answer}`}
                  title={w.grammar}
                  content={w.meaning}
                  className="mb-4 last:mb-0 w-full"
                />
              )
          )}
          <Button
            className={cn("bg-[#e36f23] text-white text-lg mt-4")}
            onPress={startNewQuiz}
          >
            New Quiz
          </Button>
          {/* TODO: wrong question detail dialog here */}
        </div>
      )}
    </div>
  );
}
