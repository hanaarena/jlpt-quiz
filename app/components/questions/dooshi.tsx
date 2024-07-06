"use client";

import RandomButton from "../randomButton";
import { useEffect, useMemo, useState } from "react";
import { questionKeywordAtom, questionTypeAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";
import { randomDooshiKana } from "@/app/data";
import { ChatTypeValue } from "@/app/utils/const";
import Markdown from "react-markdown";
import Loading from "../loading";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CorrectIcon from "../icons/correct";
import WrongIcon from "../icons/wrong";
import { randomInRange } from "@/app/utils/fns";
import confetti from "canvas-confetti";
import { convertJpnToKana } from "@/app/utils/jpn";

export default function Dooshi() {
  const questionType = useAtomValue(questionTypeAtom);
  const { toast, dismiss } = useToast();
  const [generation, setGeneration] = useState<IDooshiGenerationResult>();
  const [isLoading, setLoading] = useState(false);
  const [keyword, setKeyword] = useAtom(questionKeywordAtom);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [kanaQuestionText, setKanaQuestionText] = useState<{
    keyword: string;
    title: string;
  }>({ keyword: "", title: "" });

  const generate = async ({ content }) => {
    setKeyword(content);
    setLoading(true);
    setShowAnswer(false);
    await fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({
        content,
        chatType: ChatTypeValue.N2Dooshi,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setGeneration(json);
        setLoading(false);
      });
    });
  };

  const handleSubmit = (ans: string) => {
    console.warn("kekek ans", ans);
    console.warn("kekek ans", generation?.questionAnswer);
    setShowAnswer(true);

    if (ans === generation?.questionAnswer) {
      // 🎉 animation
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
    } else {
      toast({
        variant: "destructive",
        title: "残念です！",
        duration: 2000,
      });
    }
  };

  const generateDooshi = () => {
    const d = randomDooshiKana();
    const { kana, kanji } = d;
    const v = `${kana}${kanji ? `(${kanji})` : ""}`;
    return v;
  };

  const replay = () => {
    setShowAnswer(false);
    setLoading(true);
    setSelectedAnswer("");
    dismiss();
    generate({ content: generateDooshi() });
  };

  useEffect(() => {
    async function parseData() {
      const _keyword = await convertJpnToKana(keyword);
      const _title = await convertJpnToKana(generation?.questionTitle || "");
      setKanaQuestionText({
        keyword: _keyword,
        title: _title,
      });
    }
    parseData();
  }, [keyword, generation?.questionTitle]);

  useMemo(() => {
    if (questionType === 1) {
      generate({ content: generateDooshi() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType]);

  return (
    <div className="question-dooshi flex items-center flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        generation &&
        Object.keys(generation).length && (
          <>
            <div className="content-wrapper text-black ml-12 mb-6">
              <div className="question mb-6">
                <span>動詞 ：</span>
                <span className="inline-flex h-auto text-black bg-black hover:text-white">
                  <b
                    dangerouslySetInnerHTML={{
                      __html: kanaQuestionText.keyword,
                    }}
                  ></b>
                </span>
              </div>
              <div className="answer">
                <h3 className="mb-4">
                  题目:{" "}
                  <span
                    dangerouslySetInnerHTML={{ __html: kanaQuestionText.title }}
                  />
                </h3>
                <h3 className="mb-4">
                  选项:{" "}
                  {generation.questionOptions.map((q) => (
                    <Button
                      key={q}
                      className={`relative hover:bg-black hover:text-white inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] border font-medium leading-none focus:outline-none mr-2 ${
                        selectedAnswer === q
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        setSelectedAnswer(q);
                        handleSubmit(q);
                      }}
                    >
                      <Markdown>{q}</Markdown>
                      <div className="absolute w-6 left-1">
                        {generation.questionAnswer === q && showAnswer && (
                          <CorrectIcon />
                        )}
                        {generation.questionAnswer !== q && showAnswer && (
                          <WrongIcon />
                        )}
                      </div>
                    </Button>
                  ))}
                </h3>
                {showAnswer && (
                  <>
                    <h3>答案: </h3>
                    <Markdown>{generation.questionExplanation}</Markdown>
                  </>
                )}
              </div>
            </div>
            <RandomButton text="再来一题" onClick={replay} className="mb-4" />
          </>
        )
      )}
    </div>
  );
}
