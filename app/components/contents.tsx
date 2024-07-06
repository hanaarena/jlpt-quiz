"use client";

import { useAtom } from "jotai";
import { questionTypeAtom, quetionContentAtom } from "./atoms";
import Dooshi from "./questions/dooshi";

export default function Contents() {
  const [content] = useAtom(quetionContentAtom);
  const [questionType] = useAtom(questionTypeAtom);

  return (
    <div className="content-body flex p-2 bg-white w-full justify-center">
      {!questionType && (
        <div className="flex w-full justify-center text-3xl mt-10 text-black">
          ～ 先选择题目类型 ～
        </div>
      )}
      {questionType > 0 && (
        <div className="question-content p-4 flex justify-center w-9/12">
          {questionType === 1 && <Dooshi />}
          {/* {questionType === 2 && <Buunbo />} */}
        </div>
      )}
    </div>
  );
}
