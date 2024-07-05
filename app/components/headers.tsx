"use client";

import { useAtom } from "jotai";
import { items } from "../utils/const";
import { questionTypeAtom } from "./atoms";

export default function Headers() {
  const [questionType, setQuestionType] = useAtom(questionTypeAtom);

  return (
    <div className="content-head flex px-3 h-16 bg-gray-100">
      <div className="title-wrapper">
        <section className="sweet-title">
          <span data-text="JLPT EASY!">JLPT EASY!</span>
        </section>
      </div>
      <div className="head-items flex">
        {items.map((i) => (
          <div
            key={i.id}
            className={`relative flex w-28 text-center text-white h-full justify-center items-center cursor-pointer ${
              i.cx
            } ${i.id === questionType && i.active}`}
            onClick={() => setQuestionType(i.id)}
          >
            {i.name}
            {i.id === questionType && (
              <div className="absolute w-full h-1 bg-white bottom-0.5"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
