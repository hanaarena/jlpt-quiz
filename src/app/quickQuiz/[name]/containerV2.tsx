"use client";

import React, { useCallback, useEffect, useState } from "react";
import { get } from "@/app/utils/request";
import { useMutation } from "@tanstack/react-query";
import { ChatTypeValue } from "@/app/utils/const";
import { shuffleOptions } from "@/app/utils/quiz";
import toast, { Toaster } from "react-hot-toast";
import { cheerful } from "@/app/utils/fns";
import LoadingV4Gemini from "@/app/components/loadingV4Gemini";

interface IMoji3Quizs extends IMoji3Quiz {
  selected: string;
}

const TITLE = "文字 (単語) Quiz";

export default function ContainerV2() {
  const [quiz, setQuiz] = useState<IMoji3Quizs[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [stage, setStage] = useState<"quiz" | "result">("quiz");
  const [wrongList, setWrongList] = useState<IMoji3Quizs[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelect = (option: string) => {
    const list = [...quiz];
    list[currentIndex].selected = option;
    setQuiz(list);
    const item = list[currentIndex];

    if (item.answer !== option) {
      setWrongList(p => {
        return [...p, item];
      });
    }

    if (option === item.answer) {
      cheerful();
    } else {
      toast.error("Wrong!", { duration: 2000 });
    }
  };

  const detectOptionClx = (option: string) => {
    const current = quiz[currentIndex];
    const isSelected = current.selected === option;
    const isCorrect = option === current.answer;
    let clx = "w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base font-medium ";
    if (!current.selected) {
      clx +=
        "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow";
    } else if (isSelected && isCorrect) {
      clx +=
        "bg-green-100 border-green-400 text-green-700 font-bold";
    } else if (isSelected && !isCorrect) {
      clx += "bg-red-100 border-red-400 text-red-700 font-bold";
    } else if (isCorrect) {
      clx += "bg-green-100 border-green-200 text-green-600";
    } else {
      clx += "bg-gray-50 border-gray-100 text-gray-400";
    }

    return clx;
  }

  async function wrapMutation() {
    const cacheContent = await get<{ data: { list: string[] }}>(`/api/quiz/gemini/questions?name=${ChatTypeValue.Moji3}&length=2`)

    if (cacheContent.data?.list) {
      return cacheContent;
    }

    throw new Error("Quiz is not ready for this time");
  }
  
  const { mutate, isPending, error } = useMutation({
    mutationFn: wrapMutation,
    onMutate: () => {
      setCurrentIndex(i => i + 1);
    },
    onSuccess: (res) => {
      const { list } = res.data || {};
      const quizArr: IMoji3Quizs[] = [];
      if (list?.length) {
        list.forEach(l => {
          // `o` is quiz array:
          // [`question`, `options`, `answer`, `translation`, `options explanation]
          const o = l.split("[sperator]");
          const resultArr: string[] = [];
          const regex = /\<mm\>([\s\S]*?)\<\/mm\>/gm;
          o.forEach((item) => {
            let m;
            while ((m = regex.exec(item)) !== null) {
              if (m.index === regex.lastIndex) {
                regex.lastIndex++;
              }
              resultArr.push(m[1]);
            }
          });
          const [question, options, answer, translation, explanation] = resultArr;
          const [opts, ans] = shuffleOptions(options, answer);
          quizArr.push({
            question,
            options: opts,
            answer: ans,
            explanation: explanation?.replaceAll("\n", "<br />"),
            translation,
            selected: ""
          });
        })
      }
      
      setQuiz(quizArr);
    },
    onError: (err) => {
      toast.error("Get quiz failed, retrying: " + err, { duration: 2000 });
    },
    retryDelay: 1000,
    retry: 2,
  });

  const handleNext = useCallback(() => {
    if (currentIndex + 1 === quiz.length) {
      setStage("result");
    } else {
      mutate();
    }
  }, [])

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
    }
  }

  useEffect(() => {
    handleNext();
  }, [handleNext]);

  if (stage === "result") {
    return (
      <div className="flex flex-col min-h-screen w-full items-center bg-gradient-to-br from-blue-50 to-green-50 px-2 py-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-4 flex flex-col gap-4 mt-4">
          <div className="text-gray-500 text-xs font-medium tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-base">quiz</span>
            {TITLE}
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
                {wrongList.length} / {quiz.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Incorrect: {wrongList.length}
              </div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-xs text-gray-400 font-medium mb-1">
                Accuracy
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {Math.floor(wrongList.length/quiz.length) * 100}%
              </div>
            </div>
          </div>
          {/* <div className="mt-4">
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
          </div> */}
          <button className="mt-6 w-full py-3 rounded-full border border-blue-300 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition text-base shadow-sm">
            Review quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Toaster />
      {
        isPending ? <LoadingV4Gemini /> :
        <div className="w-full h-screen  rounded-xl md:shadow-lg p-4 flex flex-col gap-4 relative">
          <div className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide">
            {TITLE}
          </div>
          <div className="text-xs text-gray-400 mb-1 sm:mb-2">{`${currentIndex} / ${quiz.length}`}</div>
          <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4 leading-relaxed">
            <p dangerouslySetInnerHTML={{__html: quiz[currentIndex].question}} />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            {quiz[currentIndex].options.map((opt) => {
              const btnClass = detectOptionClx(opt)
              return (
                <button
                  key={opt}
                  className={btnClass}
                  disabled={!!quiz[currentIndex].selected}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <p onClick={() => setShowHint(p => !p)}>Hint</p>
          {showHint && (
            <div className="max-h-[150px] overflow-y-auto mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded text-xs sm:text-base">
              <div className="font-semibold mb-1">Explanation</div>
              <div dangerouslySetInnerHTML={{__html: quiz[currentIndex].translation}} />
              <div dangerouslySetInnerHTML={{__html: quiz[currentIndex].explanation}} />
            </div>
          )}
          {
            error && <div>{error.message} <p>Click to refresh page</p></div>
          }
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex sm:flex-row gap-2 sm:gap-4 justify-between mt-6 sm:mt-8 w-10/12">
            <button
              className="w-1/3 sm:w-auto px-4 sm:px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition text-sm sm:text-base"
              onClick={handlePrevious}
            >
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
      }
    </div>
  );
}
