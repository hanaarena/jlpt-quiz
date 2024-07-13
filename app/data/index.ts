import n2Dooshi, {dataKeys} from "./jlpt-n2-dooshi";
import n2All, {dataKeys as allDataKeys} from "./jlpt-n2-all";

export function randomDooshiKana(): {kana: string; kanji: string; type: string; meaning: string;} {
  const key = dataKeys[dataKeys.length * Math.random() << 0]
  return n2Dooshi[key];
}

/**
 * Random pick from all n2 vocabulary
 * @returns Object
 */
export function randomAllMoji(): {kana: string; kanji: string; type: string; meaning: string;} {
  const key = allDataKeys[allDataKeys.length * Math.random() << 0]
  return n2All[key];
}
