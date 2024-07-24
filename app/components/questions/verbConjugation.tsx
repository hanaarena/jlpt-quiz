import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Murecho } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { questionTypeAtom } from "../atoms";
import { randomDooshiKana2 } from "@/app/data";
import { convertJpnToKana } from "@/app/utils/jpn";
import { conjugate } from "@/lib/kamiya-codec";
import Loading from "../loading";

const murecho = Murecho({
  weight: "600",
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function VerbConjugation() {
  const questionType = useAtomValue(questionTypeAtom);
  const [keywordHtml, setKeywordHtml] = useState("");
  const [keyword, setKeyword] = useState({
    kana: "",
    kanji: "",
    type: "",
    meaning: "",
  });
  const [answerObj, setAnswerObj] = useState({
    dictionary: "",
    negative: "",
    ta: "",
    taNai: "",
  });
  const [answerStatus, setAnswerStatus] = useState({
    dictionary: false,
    negative: false,
    ta: false,
    taNai: false,
  });

  const generateKeyword = async () => {
    const word = randomDooshiKana2();
    setKeyword(word);
  };

  useEffect(() => {
    const data = async () => {
      if (keyword && Object.keys(keyword)) {
        console.warn("kekek keyword", keyword);
        let str = "";
        if (keyword.kana && !keyword.kanji) {
          str = keyword.kana;
        } else {
          str = await convertJpnToKana(keyword.kanji);
        }

        setKeywordHtml(str);

        // ます形
        const dictionary = conjugate(str, ["Masu"], "Dictionary");
        // ない形
        const negative = conjugate(str, [], "Negative");
        // なかった形
        const taNai = conjugate(str, ["Nai"], "Ta");
        // た形
        const ta = conjugate(str, [], "Ta");
        setAnswerObj({
          dictionary,
          negative,
          ta,
          taNai,
        });
      }
    };
    setTimeout(() => {
      data();
    }, 1000);
  }, [keyword, keyword.kana]);

  useMemo(() => {
    if (questionType === 6) {
      generateKeyword();
    }
  }, [questionType]);

  return (
    <div className={cn(murecho.className)}>
      {keywordHtml ? (
        <>
          <div className="text-center mt-6 text-4xl">
            {keywordHtml && (
              <p dangerouslySetInnerHTML={{ __html: keywordHtml }}></p>
            )}
            {keyword.meaning && <p className="text-xs">*{keyword.meaning}</p>}
          </div>
          <div className="container relative">
            <div className="absolute m-auto">
              <div className="horizon"></div>
              <div className="vertical"></div>
            </div>
            <div
              className="masu-kei"
              dangerouslySetInnerHTML={{ __html: answerObj.dictionary }}
            />
            <div
              className="nai-kei"
              dangerouslySetInnerHTML={{ __html: answerObj.negative }}
            />
            <div
              className="ta-kei"
              dangerouslySetInnerHTML={{ __html: answerObj.ta }}
            />
            <div
              className="nakata-kei"
              dangerouslySetInnerHTML={{ __html: answerObj.taNai }}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
