"use client";

import React, { useState } from "react";

const sampleQuestion = {
  number: 9,
  total: 10,
  text: "彼の話は（　　）が多くて、どこまで本当かわからない。",
  options: [
    { key: "A", value: "豪華" },
    { key: "B", value: "派手" },
    { key: "C", value: "盛大" },
    { key: "D", value: "大げさ" },
  ],
  answer: "D",
  hint: "『大げさ』 means 'exaggeration', which fits the context of not knowing how much is true.",
};

export default function ContainerV2() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [stage, setStage] = useState<"quiz" | "result">("quiz");

  const result = {
    score: 3,
    total: 10,
    incorrect: 7,
    skipped: 0,
    accuracy: 30,
    highlights: [
      "文法（～ところで、～ぎりぎり）：「いくら～ところで」や「締め切りぎりぎり」のような、特定の文法ポイントや表現を正しく理解して使えています。これらの複雑な表現を使いこなせているのは素晴らしいです。",
      "語彙（日常的な表現）：「居眠りしてしまった」のような、日常的によく使われる動詞のフレーズを正確に選べています。文脈に合った自然な言葉を選ぶ力があります。",
    ],
    focusAreas: [
      "敬語の使い分け: 謙譲語「伺う」と丁寧語「お聞きする」の使い分けに課題があるようです。",
    ],
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    setShowHint(true);
  };

  const handleNext = () => {
    // For demo, always go to result after one question
    setStage("result");
  };

  if (stage === "result") {
    return (
      <div className="flex flex-col min-h-screen w-full items-center bg-gradient-to-br from-blue-50 to-green-50 px-2 py-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-4 flex flex-col gap-4 mt-4">
          <div className="text-gray-500 text-xs font-medium tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-base">quiz</span>
            JLPT N2 練習問題
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-2 mb-1">
            You Did it! Quiz Complete
          </div>
          <div className="flex gap-2 w-full mt-2">
            <div className="flex-1 bg-blue-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-xs text-gray-400 font-medium mb-1">
                Score
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {result.score}/{result.total}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Incorrect: {result.incorrect}
              </div>
              <div className="text-xs text-gray-400">
                Skipped: {result.skipped}
              </div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-xs text-gray-400 font-medium mb-1">
                Accuracy
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {result.accuracy}%
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold text-base text-gray-800 mb-1">
              Highlights
            </div>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {result.highlights.map((h, i) => (
                <li key={i} className="mb-1">
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <div className="font-semibold text-base text-gray-800 mb-1">
              Focus areas
            </div>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {result.focusAreas.map((f, i) => (
                <li key={i} className="mb-1">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <button className="mt-6 w-full py-3 rounded-full border border-blue-300 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition text-base shadow-sm">
            Review quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full h-screen  rounded-xl md:shadow-lg p-4 flex flex-col gap-4 relative">
        <div className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide">
          JLPT N2 練習問題
        </div>
        <div className="text-xs text-gray-400 mb-1 sm:mb-2">{`${sampleQuestion.number} / ${sampleQuestion.total}`}</div>
        <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4 leading-relaxed">
          {sampleQuestion.text}
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          {sampleQuestion.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrect = opt.key === sampleQuestion.answer;
            let btnClass =
              "w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base font-medium ";
            if (!selected) {
              btnClass +=
                "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow";
            } else if (isSelected && isCorrect) {
              btnClass +=
                "bg-green-100 border-green-400 text-green-700 font-bold";
            } else if (isSelected && !isCorrect) {
              btnClass += "bg-red-100 border-red-400 text-red-700 font-bold";
            } else if (isCorrect) {
              btnClass += "bg-green-100 border-green-200 text-green-600";
            } else {
              btnClass += "bg-gray-50 border-gray-100 text-gray-400";
            }
            return (
              <button
                key={opt.key}
                className={btnClass}
                disabled={!!selected}
                onClick={() => handleSelect(opt.key)}
              >
                <span className="font-semibold mr-2">{opt.key}.</span>{" "}
                {opt.value}
              </button>
            );
          })}
        </div>
        {showHint && (
          <div className="max-h-[150px] overflow-y-auto mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded text-xs sm:text-base">
            <div className="font-semibold mb-1">Explanation</div>
            <div>{sampleQuestion.hint}</div>
          </div>
        )}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex sm:flex-row gap-2 sm:gap-4 justify-between mt-6 sm:mt-8 w-10/12">
          <button className="w-1/3 sm:w-auto px-4 sm:px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition text-sm sm:text-base">
            Back
          </button>
          <button
            className="w-1/3 sm:w-auto px-4 sm:px-6 py-2 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-sm sm:text-base"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
