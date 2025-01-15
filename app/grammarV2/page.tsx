"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getRandomGrammarV2ByCount,
  type GrammarLevelTypeV2,
  type TGrammarV2
} from "@/app/data/grammarV2/index";
import { generateGemini } from "../actions/gemeni";
import { cheerful, shuffleArray } from "../utils/fns";
import { atom, useAtom } from "jotai";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import StageStart from "./stageStart";
import StageTesting from "./stageTesting";
import StageResult from "./stageResult";
import StageReview from "./stageReview";
import { datasetAtom, prevStageAtom } from "./atom";
import { parseAnswer } from "../data/grammar";

import style from "./page.module.css";
import { GrammarSTAGE } from "../types";
import { historyPushHash } from "../utils/history";

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
  const [stage, setStage] = useState<GrammarSTAGE>(GrammarSTAGE.START);
  const [currentLevel, setCurrentLevel] = useState<GrammarLevelTypeV2>("n5");
  const [grammarList, setGrammarList] = useState<TGrammarV2[]>([]);
  const [quizList, setQuizList] = useAtom(initQuizList);
  const [wrongList, setWrongList] = useState<TCurrentQuiz[]>([]);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [currentGrammarIndex, setCurrentGrammarIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<TCurrentQuiz>(
    {} as TCurrentQuiz
  );
  const [dataset] = useAtom(datasetAtom);
  const [prevStage, setPrevStage] = useAtom(prevStageAtom);

  useEffect(() => {
    document.title = "Grammar quiz - JLPT EASY";
    if (window.location.hash) {
      // replace state & reload page to avoid anoying hash history
      history.replaceState(null, "", window.location.pathname);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      const p = [...prevStage].pop();
      if (p) {
        setStage(p);
        setPrevStage(prevStage.slice(0, -1));
      }
    });

    return () => {
      window.removeEventListener("popstate", () => {});
    };
  }, [prevStage, stage]);

  function handleChangStage(_stage: GrammarSTAGE, level?: GrammarLevelTypeV2) {
    setPrevStage([...prevStage, stage]);
    historyPushHash(_stage);
    switch (_stage) {
      case GrammarSTAGE.REVIEW:
        setCurrentGrammarIndex(0);
        getGrammarList(level);
        break;
      case GrammarSTAGE.TESTING:
        setCurrentGrammarIndex(0);
        pickQuiz(0);
        break;
    }
    setStage(_stage);
  }

  const getGrammarList = (level: GrammarLevelTypeV2 = currentLevel) => {
    const list = getRandomGrammarV2ByCount(level, 5, dataset);
    setGrammarList(list);
    generateQuizList(list);
  };

  const generateQuizList = (_grammarList: TGrammarV2[]) => {
    let list: IQuiz[] = [];
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
          const _g = parseAnswer(g, e);
          sentence = _g.sentence;
          ans = _g.answerText;
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
          english_meaning: e[2] || e[1], // in v1 dataset,e[2] is the english translation
          answer: ans,
          examples: randomExamples
        });
      });
    });

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
      handleChangStage(GrammarSTAGE.RESULT);
    }
  };

  const startNewQuiz = () => {
    setWrongList([]);
    getGrammarList();
    handleChangStage(GrammarSTAGE.REVIEW);
  };

  return (
    <>
      <div className={cn(style.bg_image_fixed)}></div>
      <div className={cn("h-full relative z-1")}>
        <Toaster />
        {stage === GrammarSTAGE.START && (
          <StageStart
            onClick={(level) => {
              setCurrentLevel(level);
              setTimeout(() => {
                handleChangStage(GrammarSTAGE.REVIEW, level);
              }, 820);
            }}
          />
        )}
        {stage === GrammarSTAGE.REVIEW && (
          <StageReview
            level={currentLevel}
            grammarList={grammarList}
            index={currentGrammarIndex}
            handleChangStage={handleChangStage}
            updateGrammarIndex={(index) => setCurrentGrammarIndex(index)}
          />
        )}
        {stage === GrammarSTAGE.TESTING && (
          <StageTesting
            quizList={quizList}
            currentGrammarIndex={currentGrammarIndex}
            quizOptions={quizOptions}
            currentQuiz={currentQuiz}
            handleSubmit={(ans, index) => handleQuizSubmit(ans, index)}
            handleNext={() => handleNextQuiz()}
          />
        )}
        {stage === GrammarSTAGE.RESULT && (
          <StageResult
            quizList={quizList}
            wrongList={wrongList}
            onStart={startNewQuiz}
            level={currentLevel}
          />
        )}
      </div>
    </>
  );
}
