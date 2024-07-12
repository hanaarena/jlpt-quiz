"use client";

import { useAtom } from "jotai";
import { questionTypeAtom } from "./atoms";
import Dooshi from "./questions/dooshi";
import Moji1 from "./questions/moji-1";

export default function Contents() {
  const [questionType] = useAtom(questionTypeAtom);

  return (
    <div className="content-body flex p-2 bg-white w-full justify-center">
      {questionType < 1 && (
        <div className="flex flex-col w-full justify-center items-center">
          <div className="title-wrapper mb-10">
            <section className="sweet-title">
              <span data-text="JLPT EASY!">JLPT EASY!</span>
            </section>
          </div>
          <div className="text-3xl mt-10 text-black">～ 先选择题目类型 ～</div>
        </div>
      )}
      {questionType > 0 && (
        <div className="question-content p-4 flex justify-center w-9/12">
          {questionType === 1 && <Dooshi />}
          {/* {questionType === 2 && <Buunbo />} */}
          {questionType === 3 && <Moji1 />}
        </div>
      )}
    </div>
  );
}
