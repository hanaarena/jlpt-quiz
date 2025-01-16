import { Button, CircularProgress, cn, Spacer } from "@nextui-org/react";
import style from "./page.module.css";
import { IQuiz, TCurrentQuiz } from "./page";
import QuestionDetailDialog from "./questionDetailDialog";
import { GrammarLevelTypeV2 } from "../data/grammarV2";
import { GrammarSTAGE } from "../types";

interface IStageResultProps {
  quizList: IQuiz[];
  wrongList: TCurrentQuiz[];
  reStart?: () => void;
  level: GrammarLevelTypeV2;
  handleChangStage: (stage: GrammarSTAGE) => void;
}

export default function StageResult({
  quizList,
  wrongList,
  reStart,
  level
}: IStageResultProps) {
  return (
    <div className="stage-result flex flex-col items-center px-6 min-h-screen">
      <div
        className={cn(
          "rounded-full w-20 h-20 flex items-center justify-center text-3xl",
          "fixed border bold top-[10px] right-[10px] rotate-12 scale-[2] opacity-10",
          style.title_color,
          style.icon_bg,
          style.icon_border
        )}
      >
        {level.toUpperCase()}
      </div>
      <div className={cn(style.title_color, "text-4xl bold mt-4 mb-4")}>
        Score
      </div>
      <CircularProgress
        aria-label="score-progress"
        classNames={{
          base: "mb-8",
          svg: "w-40 h-40 drop-shadow-md",
          value: "text-3xl font-semibold text-yellow-500"
        }}
        color="warning"
        showValueLabel={true}
        strokeWidth={4}
        value={Number(
          (
            ((quizList.length - wrongList.length) / quizList.length) *
            100
          ).toFixed(0)
        )}
      />
      <div className="mb-4 flex items-center">
        <Button
          className={cn("bg-[#e36f23] text-white text-lg")}
          onPress={() => {
            if (reStart) {
              reStart();
            }
          }}
        >
          New Quiz
        </Button>
        <Spacer x={2} />
        or
        <Spacer x={2} />
        <Button
          className={cn("bg-[#e36f23] text-white text-lg ")}
          onPress={() => {
            history.replaceState(null, "", window.location.pathname);
            // TODO: maybe cause double reload, need to find a better way
            window.location.reload();
          }}
        >
          Reselect level
        </Button>
      </div>
      {wrongList.length > 0 && (
        <p className={cn(style.title_color, "text-sm mb-2")}>
          Wrong questions(click to check detail):
        </p>
      )}
      {wrongList.map(
        (w, index) =>
          w.sentence && (
            <QuestionDetailDialog
              key={`wrong-${index}-${w.grammar}`}
              quiz={w}
            />
          )
      )}
      <Spacer y={4} />
    </div>
  );
}
