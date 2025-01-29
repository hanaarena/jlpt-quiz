import { EJLPTLevel } from "@/app/types";

import n1Kanji from "./n1-kanji-v2-list.json";
import n2Kanji from "./n2-kanji-v2-list.json";
import n3Kanji from "./n3-kanji-v2-list.json";

const obj = {
  n1Kanji,
  n2Kanji,
  n3Kanji
};

export interface KanjiV2 { kanji: string; kana: string; meaning: string }
export type TKanjiV2 = KanjiV2[]
type TDataset = typeof obj[keyof typeof obj];

export function getRandomKanjiV2(
  level: EJLPTLevel,
  count = 1
): TKanjiV2 {
  const dataset: TDataset = obj[`${level}Kanji`];
  const arr: TKanjiV2 = [];

  let uniteCount = 0;
  while (uniteCount < count) {
    const r = arr[uniteCount];
    if (r && !arr.find((a) => a.kanji === r.kanji)) {
      uniteCount += 1;
    } else {
      let index = Math.floor(Math.random() * dataset.list.length);
      let item = dataset.list[index]
      while (arr.find((g) => g.kanji === item.kanji)) {
        index = Math.floor(Math.random() * dataset.list.length);
        item = dataset.list[index]
      }
      arr.splice(uniteCount, 1, item);
      uniteCount++;
    }
  }

  return arr;
}
