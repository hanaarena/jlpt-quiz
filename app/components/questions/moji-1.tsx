import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { questionTypeAtom } from "../atoms";
import { randomAllMoji } from "@/app/data";
import { generateGemini } from "@/app/actions/gemeni";
import { toast } from "@/components/ui/use-toast";
import { ChatTypeValue } from "@/app/utils/const";
import { handleKanjiOutput } from "@/app/actions/quizGenerationParse";
import Loading from "../loading";
import Markdown from "react-markdown";
import RandomButton from "../randomButton";

export default function Moji1() {
  const questionType = useAtomValue(questionTypeAtom);
  const [isLoading, setLoading] = useState(false);
  const [generation, setGeneration] = useState("");

  const generateMoji = () => {
    const d = randomAllMoji();
    const { kana, kanji } = d;
    console.warn("generateMoji d", d);
    const v = kanji ? kanji : kana;
    return v;
  };

  const generate = async ({ content }) => {
    setLoading(true);
    generateGemini({ content, chatType: ChatTypeValue.N2Moji1 }).then(
      async (result) => {
        const res = { ...result };
        if (res instanceof Error) {
          toast({
            title: "Gemini failed",
            description: res.message,
            variant: "destructive",
          });
          return;
        }

        if (res.text) {
          res.text = res.text.replace(/\n/g, "  \n");
          const content = await handleKanjiOutput(res.text);
          setGeneration(content);
          setLoading(false);
        }
      }
    );
  };

  const replay = () => {
    setLoading(true);
    generate({ content: generateMoji() });
  };

  useMemo(() => {
    if (questionType === 3) {
      generate({ content: generateMoji() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType]);
  return (
    <div className="moji-1">
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <RandomButton text="再来一题" onClick={replay} className="mb-4" />
          <Markdown>{generation}</Markdown>
        </div>
      )}
    </div>
  );
}
