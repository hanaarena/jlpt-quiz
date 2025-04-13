"use client";

import QuizAnswerModal from "@/app/components/quizAnsewerModal";
import { EJLPTLevel } from "@/app/types";
import { post } from "@/app/utils/request";
import { getRandomKanjiV2 } from "@/data/kanjiV2";
import { Button, cn } from "@heroui/react";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";

interface IQuiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuickQuizTest() {
  const questionCount = 10;
  const [quiz, setQuiz] = useState<IQuiz[]>([]);
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [wrongQues, setWrongQues] = useState<IQuiz[]>([]);

  const getQuestions = async () => {
    const kanjiList = getRandomKanjiV2(EJLPTLevel.N2, questionCount, true);
    const str = kanjiList.map((k) => k.kanji).join(",");
    await post<{
      data: { generatedText: string; name: string; quizName: string };
    }>("/api/quiz/gemini/questions", {
      content: str,
      name: "moji_1",
    }).then((r) => {
      const { generatedText } = r.data || {};
      const o = generatedText.split("<hr>");
      const resultArr: IQuiz[] = [];
      const regex = /\<mm\>([\s\S]*?)\<\/mm\>/gm;
      o.forEach((item) => {
        // array format: [question, options, answer, explanation]
        const arr = [];
        let m;
        while ((m = regex.exec(item)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          arr.push(m[1]);
        }
        resultArr.push({
          question: arr[0],
          options: arr[1].split("\n").filter((o) => o),
          answer: arr[2],
          explanation: arr[3],
        });
      });
      setQuiz(resultArr);
      setCurrentIndex(0);
    });
  };

  const detection = (selected: string) => {
    if (answer) return;

    const q = quiz[currentIndex];
    setAnswer(selected);

    if (selected !== q.answer) {
      setWrongQues((old) => [...old, q]);
    }
  };

  const handleNext = () => {
    if (currentIndex <= questionCount - 1) {
      setAnswer("");
      setCurrentIndex((p) => p + 1);
    }
  };

  const handleReset = () => {
    setAnswer("");
    setWrongQues([]);
    getQuestions();
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div className="flex items-center flex-col max-w-[80%] mx-auto mt-14">
      {currentIndex > -1 && currentIndex <= questionCount - 1 && (
        <>
          <div className="progress mb-10">
            {currentIndex + 1} / {questionCount}
          </div>

          {quiz[currentIndex] && (
            <>
              <div
                className={cn("question mb-2", "question-text")}
                dangerouslySetInnerHTML={{
                  __html: quiz[currentIndex].question,
                }}
              />
              <div className="options">
                {quiz[currentIndex].options.map((o) => (
                  <Button
                    key={o}
                    color="primary"
                    variant="ghost"
                    className={cn(
                      "active:border-none",
                      "text-[color:--moji-text-color] border-[--moji-text-color]",
                      "data-[hover=true]:!bg-[--moji-text-color]",
                      "data-[hover=true]:!border-[--moji-text-color]",
                      answer && o === quiz[currentIndex].answer
                        ? "bg-green-500 border-green-500"
                        : answer === o &&
                            answer !== quiz[currentIndex].answer &&
                            "bg-red-500 border-red-500"
                    )}
                    onPress={() => detection(o)}
                  >
                    {o}
                  </Button>
                ))}
              </div>
              <div className="actions mt-10 flex items-center">
                {answer && (
                  <QuizAnswerModal className="mr-4">
                    <p className="text-lg font-bold">Explanation</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: quiz[currentIndex].explanation.replaceAll(
                          "\n",
                          "<br>"
                        ),
                      }}
                    />
                  </QuizAnswerModal>
                )}
                <Button onPress={handleNext}>Next</Button>
              </div>
            </>
          )}
        </>
      )}
      {currentIndex > questionCount - 1 && (
        <div className="final w-full">
          <p className="text-4xl font-bold">Score</p>
          <p className="mb-10">
            {Math.floor((questionCount - wrongQues.length) / questionCount)}%
          </p>
          <Accordion variant="light">
            {wrongQues.map((w) => (
              <AccordionItem
                key={w.answer}
                title={<p dangerouslySetInnerHTML={{ __html: w.question }}></p>}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: w.explanation.replaceAll("\n", "<br>"),
                  }}
                />
              </AccordionItem>
            ))}
          </Accordion>
          <Button className="mb-14" onPress={handleReset}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
