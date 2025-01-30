import n2Dooshi, {
  dataKeys,
  dataWithoutNoun,
  dataKeysWithouNoun
} from "./jlpt-n2-dooshi";
import n2All, { dataKeys as allDataKeys } from "./jlpt-n2-all";
import N2Kanji from "./n2_kanji-list.json";
import N2KanjiCore from "./n2-kanji-core-list.json";
import N1Word from "./n1_words.json";

export type TN2KanjiMode = "core" | "all";
export interface IKanjiDetailRes {
  kanji: string;
  kana: string;
  translation: string;
  type: string;
  index: number;
}

export function randomDooshiKana(): {
  kana: string;
  kanji: string;
  type: string;
  meaning: string;
} {
  const key = dataKeys[(dataKeys.length * Math.random()) << 0];
  return n2Dooshi[key];
}

/**
 * Random pick from all n2 vocabulary without Noun
 */
export function randomDooshiKana2(): {
  kana: string;
  kanji: string;
  type: string;
  meaning: string;
} {
  const key =
    dataKeysWithouNoun[(dataKeysWithouNoun.length * Math.random()) << 0];
  return dataWithoutNoun[key];
}

/**
 * Random pick from all n2 vocabulary
 * @returns Object
 */
export function randomAllMoji(): {
  kana: string;
  kanji: string;
  type: string;
  meaning: string;
} {
  const key = allDataKeys[(allDataKeys.length * Math.random()) << 0];
  return n2All[key];
}

function getN2kanjiList(mode: "core" | "all") {
  const list = mode === "core" ? N2KanjiCore : N2Kanji;
  const n2KanjiList = (
    list.kanjilist.kanji as {
      compound: {
        kanji: string;
        kana: string;
        translation: string;
        type: string;
      }[];
    }[]
  ).flatMap((entry, index) => {
    if (Array.isArray(entry.compound)) {
      return entry.compound.map((compound) => ({
        ...compound,
        index
      }));
    } else if (
      Object.prototype.toString.call(entry.compound) === "[object Object]"
    ) {
      return [
        {
          ...(entry.compound as {
            kanji: string;
            kana: string;
            translation: string;
            type: string;
          }),
          index
        }
      ];
    }
    return [];
  });

  return n2KanjiList;
}

/**
 * Random pick from all n2 vocabulary
 * @param mode - ["core" | "all"] - default is "all",core for item which frequency bigger than 1000
 * @returns Object {kanji: string;kana: string;translation: string;type: string;index: number;}
 */
export function getRandomKanji(mode: TN2KanjiMode = "all"): IKanjiDetailRes {
  const list = getN2kanjiList(mode);
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

export type TKanjiDetail = {
  compound:
    | {
        kanji: string;
        kana: string;
        translation: string;
        type: string;
      }[]
    | {
        kanji: string;
        kana: string;
        translation: string;
        type: string;
      };
  char: string;
  jis208: string;
  meaning: string;
  on: string;
  kun: string;
  stroke_count: string;
  frequency: string;
};

export function getKanjiDetailByIndex(index: number, mode: TN2KanjiMode = "all"): TKanjiDetail {
  return mode === "core" ? N2KanjiCore.kanjilist.kanji[index] : N2Kanji.kanjilist.kanji[index];
}

export function getKanjiDetailByKana(kana: string) {
  return getN2kanjiList("all").find((item) => {
    return item.kana === kana || item.kanji === kana;
  });
}

export function getRandomKanjiN1() {
  const index = Math.floor(Math.random() * N1Word.list.length);
  return N1Word.list[index];
}
