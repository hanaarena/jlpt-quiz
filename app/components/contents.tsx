"use client";

import { useAtom, useSetAtom } from "jotai";
import { collapsedAtom, questionTypeAtom } from "./atoms";
import Dooshi from "./questions/dooshi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { findItemByid } from "../utils/const";
import Moji1 from "./questions/moji-1";
import Moji2 from "./questions/moji-2";
import Moji3 from "./questions/moji-3";
import Bunpoo from "./questions/bunpoo";
import VerbConjugation from "./questions/verbConjugation";

export default function Contents() {
  const [questionType, setQuestionType] = useAtom(questionTypeAtom);
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const setCollapsed = useSetAtom(collapsedAtom);

  const handleCollapse = () => {
    setCollapsed(true);
  };

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      setQuestionType(Number(id));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="content-body flex py-2 px-3 bg-white w-full justify-center">
      {!loading &&
        (questionType < 1 ? (
          <div
            className="flex flex-col w-full justify-center items-center"
            onClick={handleCollapse}
          >
            <div className="text-xl text-black">～ 先选择题目类型 ～</div>
          </div>
        ) : (
          <div
            className="question-content mt-[52px] flex flex-col items-center w-full"
            onClick={handleCollapse}
          >
            <div className="flex justify-start w-full">
              <div className="quiz-tag text-xs mb-2 rounded px-2 text-white bg-blue-600">
                {findItemByid(questionType)?.name}
              </div>
            </div>
            {questionType === 1 && <Dooshi />}
            {questionType === 2 && <Bunpoo />}
            {questionType === 3 && <Moji1 />}
            {questionType === 4 && <Moji2 />}
            {questionType === 5 && <Moji3 />}
            {questionType === 6 && <VerbConjugation />}
          </div>
        ))}
    </div>
  );
}
