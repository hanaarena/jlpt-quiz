import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
const kuroshiro = new Kuroshiro();
kuroshiro.init(new KuromojiAnalyzer({dictPath: "/dict"}));

export function convertJpnToKana(text: string): Promise<string> {
  return kuroshiro.convert(text, {
    to: "hiragana",
    mode: "furigana",
  });
}
