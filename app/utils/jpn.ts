"use client";

import { conjugate } from "@/lib/kamiya-codec";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { VerbTypeMap } from "./const";
const kuroshiro = new Kuroshiro();
(async () => {
  await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }));
})();

/**
 *
 * @param text
 * @returns
 * @example
 * // mode: furigana
 * await kuroshiro.convert("感");
 * // result: <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>
 */
export async function convertJpnToKana(text: string): Promise<string> {
  try {
    const result = await kuroshiro.convert(text, {
      to: "hiragana",
      mode: "furigana",
    });
    return result;
  } catch (e) {
    console.error("convertJpnToKana failed:", e);
    // 没有的词库会失败
    return Promise.resolve(text);
  }
}

/**
 *
 * @param text
 * @returns
 * @example
 * // mode: normal
 * await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン
 * // result：かんじとれたらてをつなごう、かさなるのはじんせいのライン
 */
export function convertJpnToHirakana(text: string): Promise<string> {
  return kuroshiro.convert(text, {
    to: "hiragana",
    mode: "normal",
  });
}

/**
 * 动词变形
 * @param word
 */
export function verbConjugation(word: string): Record<keyof typeof VerbTypeMap, string> {
  const obj: Record<keyof typeof VerbTypeMap, string> = {} as any;
  Object.keys(VerbTypeMap).forEach((key) => {
    obj[key] = "";

    switch (key) {
      case "dictionary":
        // 辞书形
        obj[key] = conjugate(word, ["Masu"], "Dictionary");
        break;
      case "negative":
        // 否定形
        obj[key] = conjugate(word, [], "Negative");
        break;
      case "taNai":
        // 过去否定形
        obj[key] = conjugate(word, ["Nai"], "Ta");
        break;
      case "ta":
        // 过去形
        obj[key] = conjugate(word, [], "Ta");
        break;
      case "conditional":
        // 条件形
        obj[key] = conjugate(word, [], "Conditional");
        break;
      case "potential":
        // 可能形
        obj[key] = conjugate(word, ["Potential"], "Dictionary");
        break;
      case "imperative":
        // 命令形
        obj[key] = conjugate(word, [], "Imperative");
        break;
      case "volitional":
        // 意志形
        obj[key] = conjugate(word, [], "Imperative");
        break;
      case "causativePassive":
        // 使役受身形
        obj[key] = conjugate(word, ["CausativePassive"], "Dictionary");
        break;
      case "causative":
        // 使役形
        obj[key] = conjugate(word, ["SeruSaseru"], "Dictionary");
        break;
      case "passive":
        // 受身形
        obj[key] = conjugate(word, ["ReruRareru"], "Dictionary");
        break;
    }
  });

  return obj;
}
