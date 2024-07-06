import n2Dooshi, {dataKeys} from "./jlpt-n2-dooshi";

export function randomDooshiKana(): {kana: string; kanji: string; type: string; meaning: string;} {
  const key = dataKeys[dataKeys.length * Math.random() << 0]
  return n2Dooshi[key];
}
