"use client";

import { useAtom, useSetAtom } from "jotai";
import { collapsedAtom, questionTypeAtom } from "./atoms";
import Dooshi from "./questions/dooshi";
import { useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { findItemByid } from "../utils/const";
import Moji1 from "./questions/moji-1";
import Moji2 from "./questions/moji-2";
import Moji3 from "./questions/moji-3";
import Bunpoo from "./questions/bunpoo";
import VerbConjugation from "./questions/verbConjugation";

const EntryList = [
  {
    name: "動詞活用",
    id: 1
  },
  {
    name: "文法·排序题",
    id: 2
  },
  {
    name: "漢字",
    id: 3
  },
  {
    name: "相似词意",
    id: 4
  },
  {
    name: "最佳选项",
    id: 5
  },
  {
    name: "动词普通形",
    id: 6
  }
];

const TContents = forwardRef<any>(function Contents({}, ref) {
  const [questionType, setQuestionType] = useAtom(questionTypeAtom);
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const setCollapsed = useSetAtom(collapsedAtom);

  const handleCollapse = () => {
    setCollapsed(true);
  };

  useImperativeHandle(ref, () => {
    return {
      handleUpdateQuestionType(id: number) {
        setQuestionType(id);
      }
    };
  });

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      setQuestionType(Number(id));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div
      ref={ref}
      className="content-body flex py-2 px-3 bg-white w-full justify-center"
    >
      {!loading &&
        (questionType < 1 ? (
          <div
            className="flex w-3/4 justify-center items-center flex-wrap content-center gap-4 underline underline-offset-[6px]"
            onClick={handleCollapse}
          >
            {EntryList.map((item) => (
              <div
                key={item.id}
                className={`text-lg mb-2 px-2`}
                onClick={() => {
                  setQuestionType(item.id);
                }}
              >
                {item.name}
              </div>
            ))}
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
});

export default TContents;
