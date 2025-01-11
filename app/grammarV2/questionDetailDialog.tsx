import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  cn,
  Spacer,
  Divider
} from "@nextui-org/react";
import style from "./page.module.css";

import type { TCurrentQuiz } from "./page";
import { CircleCheckBig, CircleX } from "lucide-react";
import GrammarV2DetailCard from "./card";
import { convertJpnToFurigana } from "../utils/jpn";
import { useEffect, useState } from "react";

type IProptype = {
  children?: React.ReactNode;
  quiz: TCurrentQuiz;
};

const SelectedButtons = ({
  select,
  answer
}: {
  select: string;
  answer: string;
}) => {
  const btns = [
    {
      label: "wrong",
      color: "danger",
      icon: <CircleX color="red" />,
      text: select,
      tip: "Your selected"
    },
    {
      label: "correct",
      color: "success",
      icon: <CircleCheckBig color="green" />,
      text: answer,
      tip: "Answer"
    }
  ];
  return (
    <div className="flex justify-center gap-x-10 text-center mb-4">
      {btns.map((btn) => (
        <div key={btn.label} className="wrong flex flex-col items-center">
          <p className="flex items-center gap-x-1 mb-1">
            {btn.icon}
            {btn.tip}
          </p>
          <Button
            color={btn.color as any}
            variant="flat"
            disableRipple
            disableAnimation
          >
            {btn.text}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default function QuestionDetailDialog({ children, quiz }: IProptype) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [html, setHtml] = useState("");

  const transformQuestion = async (sentence: string) => {
    const res = await convertJpnToFurigana(sentence);
    setHtml(res);
  };

  useEffect(() => {
    transformQuestion(quiz.sentence);
  }, [quiz]);

  return (
    <div className="q-detail w-full mb-4 last:mb-0">
      <GrammarV2DetailCard
        content={quiz.sentence}
        className="mb-4 last:mb-0 w-full"
        onClick={onOpen}
      />
      <Modal
        isOpen={isOpen}
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p className={cn("text-2xl mb-4 mt-4", style.title_color)}>
                  <span
                    className={cn(
                      "w-8 h-8 leading-[1.6rem] inline-block bold border-2 text-center rounded-full mr-2",
                      style.icon_border
                    )}
                  >
                    Q
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: html
                    }}
                  ></span>
                </p>
                <SelectedButtons select={quiz.selected} answer={quiz.answer} />
                <p className={cn(style.card_title, "bold text-3xl")}>
                  Explanation
                </p>
                {quiz.grammar && (
                  <GrammarV2DetailCard
                    title={"Grammar"}
                    content={quiz.grammar}
                  />
                )}
                {quiz.meaning && (
                  <GrammarV2DetailCard
                    title={"Grammar meaning"}
                    content={quiz.meaning}
                  />
                )}
                {quiz.english_meaning && (
                  <GrammarV2DetailCard
                    title={"Sentence translation"}
                    content={quiz.english_meaning}
                  />
                )}
                {quiz.examples && (
                  <GrammarV2DetailCard title={"Examples"}>
                    {quiz.examples.map((e, i) => (
                      <div
                        key={`exp-${i}`}
                        className={cn(
                          "flex flex-col w-full rounded-lg border px-4 py-2 mb-2",
                          "last:mb-0 border-yellow-500 bg-yellow-500 bg-opacity-10"
                        )}
                      >
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[0]
                          }}
                        />
                        <Divider className="my-2" />
                        <p
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: e[1]
                          }}
                        />
                        {e[2] && (
                          <>
                            <Divider className="my-2" />
                            <p
                              className="text-lg"
                              dangerouslySetInnerHTML={{
                                __html: e[2]
                              }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </GrammarV2DetailCard>
                )}
                {children}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
