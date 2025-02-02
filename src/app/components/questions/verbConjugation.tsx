import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { questionTypeAtom } from "../atoms";
import { randomDooshiKana2 } from "@/data";
import { convertJpnToFurigana, verbConjugation } from "@/app/utils/jpn";
import { VerbTypeMap } from "@/app/utils/const";
import godanIchidan from "godan-ichidan";
import Refresh from "@/app/components/icons/refresh";
import LoadingV2 from "../loadingV2";
import { cn } from "@heroui/react";

export default function VerbConjugation() {
  const questionType = useAtomValue(questionTypeAtom);
  const [keywordHtml, setKeywordHtml] = useState("");
  const [keyword, setKeyword] = useState({
    kana: "",
    kanji: "",
    type: "",
    meaning: "",
  });
  const [answerObj, setAnswerObj] = useState(() => {
    const obj: Record<string, string> = {};
    Object.keys(VerbTypeMap).forEach((key) => {
      obj[key] = "";
    });
    return obj;
  });
  const [answerStatus, setAnswerStatus] = useState(() => {
    const obj: Record<string, boolean> = {};
    Object.keys(VerbTypeMap).forEach((key) => {
      obj[key] = false;
    });
    return obj;
  });
  const [loading, setLoading] = useState(true);

  const generateKeyword = async () => {
    setLoading(true);
    setAnswerStatus(() => {
      const obj: Record<string, boolean> = {};
      Object.keys(VerbTypeMap).forEach((key) => {
        obj[key] = false;
      });
      return obj;
    });

    const word = randomDooshiKana2();
    setKeyword(word);
  };

  useEffect(() => {
    const data = async () => {
      if (keyword && Object.keys(keyword)) {
        let str = "";
        if (keyword.kana && !keyword.kanji) {
          str = keyword.kana;
        } else {
          str = await convertJpnToFurigana(keyword.kanji);
        }

        setKeywordHtml(str);

        const obj = verbConjugation(str);
        setAnswerObj(obj);
      }
    };
    setTimeout(() => {
      data();
      setLoading(false);
    }, 1000);
  }, [keyword, keyword.kana]);

  useMemo(() => {
    if (questionType === 6) {
      generateKeyword();
    }
  }, [questionType]);

  return (
    <div className={"relative"}>
      {loading ? (
        <LoadingV2 />
      ) : (
        <>
          <div className="text-center mt-6 text-5xl relative">
            {keywordHtml && (
              <p dangerouslySetInnerHTML={{ __html: keywordHtml }}></p>
            )}
            {keyword.meaning && (
              <p className="p-2 text-xs text-blue-300 mt-2 mb-2">
                {godanIchidan(keyword.kana) === "ichidan" ? "v1" : "v5"} *
                {keyword.meaning}
              </p>
            )}
            <Refresh
              className={cn(
                "absolute top-[50%] left-[86%] transform -translate-x-1/2 -translate-y-1/2",
                "border rounded border p-1 bg-gray-100 opacity-60"
              )}
              onClick={generateKeyword}
              width={30}
              height={30}
            />
          </div>
          <div className="mb-10"></div>
          <div className="container w-screen">
            {Object.keys(VerbTypeMap).map((key) => {
              return (
                <div
                  key={key}
                  className={cn(
                    "flex justify-start items-center w-full",
                    "font-bold text-blue-400 mb-2",
                    "border-b last-of-type:border-b-0"
                  )}
                >
                  <div className="text-xl mr-2 w-2/6 leading-[40px]">
                    {VerbTypeMap[key as keyof typeof VerbTypeMap]}:
                  </div>
                  <div
                    className={cn(
                      "text-xl",
                      answerStatus[key] ? "blur-0" : "blur"
                    )}
                    onClick={() => {
                      setAnswerStatus({
                        ...answerStatus,
                        [key]: !answerStatus[key],
                      });
                    }}
                    dangerouslySetInnerHTML={{ __html: answerObj[key] }}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
