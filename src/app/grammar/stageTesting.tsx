import { Button, cn, Progress } from "@heroui/react";
import LoadingV3 from "../components/loadingV3";
import { CircleCheckBig, CircleX } from "lucide-react";

import style from "./page.module.css";
import type { IQuiz, TCurrentQuiz } from "./page";
import { ReactNode, useState } from "react";
import { useAnimate } from "framer-motion";

interface StageTestingProps {
  currentGrammarIndex: number;
  quizOptions: string[];
  quizList: IQuiz[];
  currentQuiz: TCurrentQuiz;
  handleSubmit: (ans: string, index: number) => void;
  handleNext: (idx: number) => void;
}

export default function StageTesting({
  quizList,
  quizOptions,
  currentQuiz,
  handleSubmit,
  handleNext,
}: StageTestingProps) {
  const [scope, animate] = useAnimate();
  const [haveSelected, setHaveSelected] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  function detectOptionStyle(option: string) {
    const obj = { style: "", icon: null as ReactNode };
    const isCorrect =
      currentQuiz.selected === option &&
      currentQuiz.selected === currentQuiz.answer;
    const isWrong =
      currentQuiz.selected === option && currentQuiz.answer !== option;

    if (isCorrect || (haveSelected && option === currentQuiz.answer)) {
      obj.style = "!bg-green-600 [&>p]:!text-white !border-green-600";
      obj.icon = <CircleCheckBig color="white" />;
    } else if (isWrong) {
      obj.style = "!bg-red-600 [&>p]:!text-white !border-red-600";
      obj.icon = <CircleX color="white" />;
    }

    return obj;
  }

  function submitOption(option: string, index: number) {
    setHaveSelected(true);
    if (currentQuiz.answer !== option) {
      animate(
        scope.current?.children[index],
        {
          rotate: [0, 15, -15, 15, -15, 0],
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 100,
          },
        },
        { duration: 0.4 }
      );
    }
    handleSubmit(option, index);
  }

  return (
    <div className={cn("min-h-screen flex flex-col items-center px-8")}>
      <div className={cn(style.title_color, "font-bold text-4xl mt-6 mb-4")}>
        {currentIndex + 1} / {quizList.length}
      </div>
      <Progress
        aria-label="Loading..."
        className="mb-8"
        color="warning"
        value={Number(
          (((currentIndex + 1) / quizList.length) * 100).toFixed(0)
        )}
      />
      <p
        className={cn("text-2xl mb-8", style.title_color)}
        dangerouslySetInnerHTML={{ __html: currentQuiz.sentence }}
      />
      {quizOptions.length > 1 ? (
        <>
          <div className="options mb-6" ref={scope}>
            {quizOptions.map((option, index) => (
              <Button
                key={`option-${index}`}
                className={cn(
                  "w-full mb-4 border-2 rounded-sm",
                  "h-16 last:mb-0 outline-none",
                  style.icon_bg,
                  style.icon_border,
                  detectOptionStyle(option).style
                )}
                variant="shadow"
                startContent={detectOptionStyle(option).icon}
                onPress={() => submitOption(option, index)}
              >
                <p className={cn(style.card_title, "text-xl")}>{option}</p>
              </Button>
            ))}
          </div>
          {haveSelected && (
            <Button
              className={cn("bg-[#e36f23] text-white text-lg")}
              onPress={() => {
                setHaveSelected(false);
                const idx = currentIndex + 1;
                setCurrentIndex(idx);
                handleNext(currentIndex);
              }}
            >
              Next
            </Button>
          )}
        </>
      ) : (
        <LoadingV3 />
      )}
    </div>
  );
}
