import n5Data from "./all_n5_grammar.json";
import n4Data from "./all_n4_grammar.json";
import n3Data from "./all_n3_grammar.json";
import n2Data from "./all_n2_grammar.json";
import n1Data from "./all_n1_grammar.json";
import { getRandomGrammar } from "../grammar";

export type TGrammarV2 = {
  grammar?: string;
  meaning?: string;
  english_meaning?: string;
  examples: string[][];
  originalKey: string;
  explanation?: string;
};
interface GrammarLevelV2 {
  data: Record<string, Omit<TGrammarV2, "originalKey">>;
  keys: string[];
}

export type GrammarLevelTypeV2 = "n5" | "n4" | "n3" | "n2" | "n1";
export type TGrammarDataset = "v1" | "v2"

const grammarList: { [key in GrammarLevelTypeV2]: GrammarLevelV2 } = {
  n5: {
    data: n5Data,
    keys: Object.keys(n5Data),
  },
  n4: {
    data: n4Data,
    keys: Object.keys(n4Data),
  },
  n3: {
    data: n3Data,
    keys: Object.keys(n3Data),
  },
  n2: {
    data: n2Data,
    keys: Object.keys(n2Data),
  },
  n1: {
    data: n1Data,
    keys: Object.keys(n1Data),
  },
};

export function getRandomGrammarV2(level: GrammarLevelTypeV2): TGrammarV2 {
  const grammar = grammarList[level].data;
  const randomIndex = Math.floor(
    Math.random() * grammarList[level].keys.length
  );
  const key = grammarList[level].keys[randomIndex];
  return {
    ...grammar[key],
    originalKey: key,
  };
}

/**
 * pick random grammar from dataset
 * @param level 
 * @param count 
 * @param dataset {"v1" | "v2"} - there are two versions of grammar dataset,v2 is the newer one
 * @returns 
 */
export function getRandomGrammarV2ByCount(
  level: GrammarLevelTypeV2,
  count: number,
  dataset: TGrammarDataset = "v1"
) {
  let fns = getRandomGrammarV2;
  if (dataset === "v1") {
    fns = getRandomGrammar;
  }
  const arr: TGrammarV2[] = [];

  for (let i = 0; i < count; i++) {
    const grammar = fns(level);
    arr.push(grammar);
  }
  
  let uniteCount = 0;
  // grammar may be duplicated
  while (uniteCount < arr.length) {
    const grammar = arr[uniteCount];
    if (!arr.find((g) => g.originalKey === grammar.originalKey)) {
      uniteCount++;
    } else {
      let gg = fns(level);
      while (arr.find((g) => g.originalKey === gg.originalKey)) {
        gg = fns(level);
      }
      arr.splice(uniteCount, 1, gg);
      uniteCount++;
    }
  }

  return arr;
}
