import { Button, cn, Progress } from "@nextui-org/react";
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
  handleNext: () => void;
}

export default function StageTesting({
  currentGrammarIndex,
  quizList,
  quizOptions,
  currentQuiz,
  handleSubmit,
  handleNext,
}: StageTestingProps) {
  const [scope, animate] = useAnimate();
  const [haveSelected, setHaveSelected] = useState(false);

  function detectOptionStyle(option: string) {
    let obj = { style: "", icon: null as ReactNode };
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
    <div
      className={cn(
        "min-h-screen flex flex-col items-center px-8",
        style.default_bg_img,
        "!bg-[#faf5ef]/[0.85]"
      )}
    >
      <div className={cn(style.title_color, "bold text-2xl mt-6 mb-4")}>
        {currentGrammarIndex + 1} / {quizList.length}
      </div>
      <Progress
        aria-label="Loading..."
        className="mb-12"
        color="warning"
        value={Number(
          (((currentGrammarIndex + 1) / quizList.length) * 100).toFixed(0)
        )}
      />
      <p
        className={cn("text-2xl mb-8", style.title_color)}
        dangerouslySetInnerHTML={{ __html: currentQuiz.sentence }}
      />
      {quizOptions.length > 1 ? (
        <>
          <div className="options mb-8" ref={scope}>
            {quizOptions.map((option, index) => (
              <Button
                key={`option-${index}`}
                className={cn(
                  "w-full mb-5 border-2 rounded-sm",
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
          <Button
            className={cn("bg-[#e36f23] text-white text-lg")}
            onPress={() => {
              setHaveSelected(false);
              handleNext();
            }}
          >
            Next
          </Button>
        </>
      ) : (
        <LoadingV3 />
      )}
    </div>
  );
}
