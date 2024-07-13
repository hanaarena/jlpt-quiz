"use client";

import { useAtom } from "jotai";
import { questionTypeAtom } from "./atoms";
import Dooshi from "./questions/dooshi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { findItemByid } from "../utils/const";
import Moji1 from "./questions/moji-1";
import Moji2 from "./questions/moji-2";

export default function Contents() {
  const [questionType, setQuestionType] = useAtom(questionTypeAtom);
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      setQuestionType(Number(id));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="content-body flex p-2 bg-white w-full justify-center">
      {!loading &&
        (questionType < 1 ? (
          <div className="flex flex-col w-full justify-center items-center">
            <div className="title-wrapper mb-10">
              <section className="sweet-title">
                <span data-text="JLPT EASY!">JLPT EASY!</span>
              </section>
            </div>
            <div className="text-3xl mt-10 text-black">
              ～ 先选择题目类型 ～
            </div>
          </div>
        ) : (
          <div className="question-content p-4 flex flex-col items-center w-9/12">
            <div className="quiz-tag mb-20 text-sm font-bold rounded px-4 text-white bg-green-600">
              {findItemByid(questionType)?.name}
            </div>
            {questionType === 1 && <Dooshi />}
            {/* {questionType === 2 && <Buunbo />} */}
            {questionType === 3 && <Moji1 />}
            {questionType === 4 && <Moji2 />}
          </div>
        ))}
    </div>
  );
}
