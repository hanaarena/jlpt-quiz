import { EJLPTLevel } from "@/app/types";

import n1Kanji from "./n1-kanji-v2-list.json";
import n2Kanji from "./n2-kanji-v2-list.json";
import n3Kanji from "./n3-kanji-v2-list.json";

const obj = {
  n1Kanji,
  n2Kanji,
  n3Kanji,
};

export interface KanjiV2 {
  kanji: string;
  kana: string;
  meaning: string;
}
export type TKanjiV2 = KanjiV2[];
type TDataset = (typeof obj)[keyof typeof obj];

/**
 * Get random kanji from datasetV2
 * @param level {EJLPTLevel} - JLPT Level(n1,n2,n3)
 * @param count
 * @param onlyKanji {boolean} - only return kanji. excluded kana words (reason: kana keyword's generated sentence is not good)
 * @returns
 */
export function getRandomKanjiV2(
  level: EJLPTLevel,
  count = 1,
  onlyKanji = false
): TKanjiV2 {
  // @ts-expect-error we dont have n0,n4,n5 data for now
  const dataset: TDataset = obj[`${level}Kanji`];
  const len = dataset.list.length;
  const arr: TKanjiV2 = [];

  let uniteCount = 0;
  while (uniteCount < count) {
    const r = arr[uniteCount];
    if (r && !arr.find((a) => a.kanji === r.kanji)) {
      uniteCount += 1;
    } else {
      let index = Math.floor(Math.random() * len);
      let item = dataset.list[index];
      while (
        arr.find((g) => g.kanji === item.kanji) ||
        (onlyKanji && (item.kanji === item.kana || !item.kanji))
      ) {
        index = Math.floor(Math.random() * len);
        item = dataset.list[index];
      }
      arr.splice(uniteCount, 1, item);
      uniteCount++;
    }
  }

  return arr;
}
