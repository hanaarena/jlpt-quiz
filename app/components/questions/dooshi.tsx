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
import { cheerful, randomInRange } from "@/app/utils/fns";
import { convertJpnToKana } from "@/app/utils/jpn";
import { generateGemini } from "@/app/actions/gemeni";
import { handleDooshiOutput } from "@/app/actions/quizGenerationParse";
import { cn } from "@/lib/utils";

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
    generateGemini({ content, chatType: ChatTypeValue.N2Dooshi }).then(
      async (result) => {
        const res = { ...result };
        if (res instanceof Error) {
          toast({
            title: "Gemini failed",
            description: res.message,
            variant: "destructive",
          });
          return;
        }

        let questionObj = {};
        if (res.text) {
          res.text = res.text.replace(/\n/g, "  \n");
          questionObj = await handleDooshiOutput(res.text);
          setGeneration(
            Object.assign(
              {},
              res,
              questionObj
            ) as unknown as IDooshiGenerationResult
          );
          setLoading(false);
        }
      }
    );
  };

  const handleSubmit = (ans: string) => {
    setShowAnswer(true);

    if (ans === generation?.questionAnswer) {
      cheerful();
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
            <div className="content-wrapper text-black mb-6">
              <div className="question-keyword mb-6 text-sm text-blue-600 font-bold">
                <span>关键词: </span>
                <span className="inline-flex h-auto blur hover:blur-0">
                  <b
                    dangerouslySetInnerHTML={{
                      __html: kanaQuestionText.keyword,
                    }}
                  ></b>
                </span>
              </div>
              <div className="answer">
                <h3 className="mb-8 font-bold">
                  Q:
                  <span
                    dangerouslySetInnerHTML={{ __html: kanaQuestionText.title }}
                  />
                </h3>
                <div className="mb-4">
                  {generation.questionOptions.map((q) => (
                    <Button
                      key={q}
                      className={cn(
                        "question-options w-full mb-3 border-black",
                        "relative inline-flex h-[38px] items-center justify-center rounded-[6px] border leading-none",
                        selectedAnswer === q
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      )}
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
                </div>
                {showAnswer && (
                  <>
                    <h3>答案: </h3>
                    <Markdown>{generation.questionExplanation}</Markdown>
                  </>
                )}
              </div>
            </div>
            <RandomButton text="再来一题" onClick={replay} />
          </>
        )
      )}
    </div>
  );
}
