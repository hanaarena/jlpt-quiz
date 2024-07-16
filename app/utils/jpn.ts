"use client";

import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
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
