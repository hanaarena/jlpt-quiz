import n2Dooshi, {
  dataKeys,
  dataWithoutNoun,
  dataKeysWithouNoun,
} from "./jlpt-n2-dooshi";
import n2All, { dataKeys as allDataKeys } from "./jlpt-n2-all";
import N2Kanji from "./n2_kanji-list.json";

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

const n2KanjiList = (
  N2Kanji.kanjilist.kanji as {
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
      index,
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
        index,
      },
    ];
  }
  return [];
});

export function getRandomKanji(): {
  kanji: string;
  kana: string;
  translation: string;
  type: string;
  index: number;
} {
  const randomIndex = Math.floor(Math.random() * n2KanjiList.length);
  return n2KanjiList[randomIndex];
}

export function getKanjiDetail(index: number): {
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
} {
  return N2Kanji.kanjilist.kanji[index];
}
