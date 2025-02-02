"use client";

import RandomButton from "../randomButton";
import { useEffect, useState } from "react";
import { questionKeywordAtom, questionTypeAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";
import { randomDooshiKana } from "@/data";
import { ChatTypeValue } from "@/app/utils/const";
import Markdown from "react-markdown";
import Loading from "../loading";
import CorrectIcon from "../icons/correct";
import WrongIcon from "../icons/wrong";
import { cheerful } from "@/app/utils/fns";
import { convertJpnToFurigana } from "@/app/utils/jpn";
import { generateGemini } from "@/app/actions/gemini";
import { handleDooshiOutput } from "@/app/actions/quizGenerationParse";
import AnswerButton from "./AnswerButton";
import { cn } from "@heroui/react";

export default function Dooshi() {
  const questionType = useAtomValue(questionTypeAtom);
  const [generation, setGeneration] = useState<IDooshiGenerationResult>();
  const [isLoading, setLoading] = useState(false);
  const [keyword, setKeyword] = useAtom(questionKeywordAtom);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [kanaQuestionText, setKanaQuestionText] = useState<{
    keyword: string;
    title: string;
  }>({ keyword: "", title: "" });

  const generate = async () => {
    setLoading(true);
    setShowAnswer(false);
    setSelectedAnswer("");
    const content = generateDooshi();
    setKeyword(content);
    generateGemini({ content, chatType: ChatTypeValue.N2Dooshi }).then(
      async (result) => {
        const res = { ...result };
        if (res instanceof Error) {
          setLoading(false);
          return;
        }

        if (res.text) {
          res.text = res.text.replace(/\n/g, "  \n");
          const questionObj = await handleDooshiOutput(res.text);
          console.warn("kekek questionObj", questionObj);
          setGeneration(
            Object.assign(
              {},
              res,
              questionObj
            ) as unknown as IDooshiGenerationResult
          );
        }
        setLoading(false);
      }
    );
  };

  const handleSubmit = (ans: string) => {
    setSelectedAnswer(ans);
    setShowAnswer(true);

    if (ans === generation?.questionAnswer) {
      cheerful();
    }
  };

  const generateDooshi = () => {
    const d = randomDooshiKana();
    return d.kanji || d.kana;
  };

  const replay = () => {
    setSelectedAnswer("");
    generate();
  };

  useEffect(() => {
    async function parseData() {
      const _keyword = await convertJpnToFurigana(keyword);
      const _title = await convertJpnToFurigana(
        generation?.questionTitle || ""
      );
      setKanaQuestionText({
        keyword: _keyword,
        title: _title,
      });
    }
    parseData();
  }, [keyword, generation?.questionTitle]);

  useEffect(() => {
    if (questionType === 1) {
      generate();
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
                <span className="inline-flex h-auto">
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
                <div className="text-center">
                  {generation.questionOptions.map((q) => (
                    <AnswerButton
                      key={q}
                      className={cn(
                        selectedAnswer === q
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      )}
                      onClick={() => {
                        handleSubmit(q);
                      }}
                    >
                      <Markdown className="text-base">{q}</Markdown>
                      <div className="absolute w-6 left-1">
                        {generation.questionAnswer === q && showAnswer && (
                          <CorrectIcon />
                        )}
                        {generation.questionAnswer !== q && showAnswer && (
                          <WrongIcon />
                        )}
                      </div>
                    </AnswerButton>
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
