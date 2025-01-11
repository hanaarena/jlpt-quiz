import n5Data from "./all_n5_grammar.json";
import n4Data from "./all_n4_grammar.json";
import n3Data from "./all_n3_grammar.json";
import n2Data from "./all_n2_grammar.json";
import n1Data from "./all_n1_grammar.json";
import n0Data from "./all_n0_grammar.json";
import { TGrammarV2 } from "../grammarV2";

export type TGrammar = {
  grammar: string;
  meaning: string;
  explanation: string;
  examples: string[][];
};
interface GrammarLevel {
  data: Record<string, TGrammar>;
  keys: string[];
}

export type GrammarLevelType = "n5" | "n4" | "n3" | "n2" | "n1" | "n0";

const grammarList: { [key in GrammarLevelType]: GrammarLevel } = {
  n5: {
    data: n5Data,
    keys: Object.keys(n5Data)
  },
  n4: {
    data: n4Data,
    keys: Object.keys(n4Data)
  },
  n3: {
    data: n3Data,
    keys: Object.keys(n3Data)
  },
  n2: {
    data: n2Data,
    keys: Object.keys(n2Data)
  },
  n1: {
    data: n1Data,
    keys: Object.keys(n1Data)
  },
  n0: {
    data: n0Data,
    keys: Object.keys(n0Data)
  }
};

export function getRandomGrammar(level: GrammarLevelType) {
  const grammar = grammarList[level].data;
  const randomIndex = Math.floor(
    Math.random() * grammarList[level].keys.length
  );
  const key = grammarList[level].keys[randomIndex];

  return {
    ...grammar[key],
    originalKey: key
  };
}

export function parseAnswer(g: TGrammar | TGrammarV2, exampleArr: string[]) {
  const question = exampleArr[0];
  // extractContent format: ['<span class="bold">たい</span>']
  const extractedContent = question.match(/<span[^>]*>(.*?)<\/span>/g) || [];
  // pick content inside span: たい
  const answerText = extractedContent
    .map((span) => span.replace(/<\/?span[^>]*>/g, ""))
    .join("、"); // 适配多个答案填空时

  const grammar = (g.grammar || "")
    .split("\n")
    .map((t) => t.trim())
    .join("<br>");
  const meaning = (g.meaning || "")
    .split("\n")
    .map((t) => t.trim())
    .join("、");
  const sentence = question.replace(/<span[^>]*>(.*?)<\/span>/g, "____");

  return {
    grammar,
    meaning,
    answerText,
    sentence
  };
}
