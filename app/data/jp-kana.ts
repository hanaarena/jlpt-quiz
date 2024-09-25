const hiragana = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"]
const katakana = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン"]
const katakana_dakuon = ["ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ"]
const hiragana_dakuon = ["が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ","ぱ","ぴ","ぷ","ぺ","ぽ"]
const katakana_yoon = ["ャ", "ュ", "ョ", "ァ", "ィ", "ゥ", "ェ", "ォ"]
const hiragana_yoon = ["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"]

/**
 * 随机生成指定长度日语假名数组
 * @param length 
 * @returns 
 */
export function getRandomKana(length: number): string[] {
  const kana = [...hiragana, ...katakana, ...katakana_dakuon, ...katakana_yoon, ...hiragana_dakuon, ...hiragana_yoon]
  const randomKana: string[] = []
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * kana.length)
    randomKana.push(kana[randomIndex])
  }
  return randomKana
}

/**
 * 将已有假名数组填充补齐到目标长度数组
 * @param alreadyHave {string[]} 已有假名数组
 * @param targetLength {number} 目标长度
 * @returns 
 */
export function getRandomKana2(alreadyHave: string[], targetLength: number): string[] {
  const kana = [...hiragana, ...katakana, ...katakana_dakuon, ...katakana_yoon, ...hiragana_dakuon, ...hiragana_yoon]
  const randomKana: string[] = []
  for (let i = 0; i < targetLength; i++) {
    const randomIndex = Math.floor(Math.random() * kana.length)
    randomKana.push(kana[randomIndex])
  }
  // remove duplicate which exists in `alreadyHave`
  let uniqueKana = randomKana.filter(kana => !alreadyHave.includes(kana));
  uniqueKana = [...alreadyHave, ...uniqueKana];
  uniqueKana = uniqueKana.slice(0, targetLength);
  // suffle the array
  for (let i = uniqueKana.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueKana[i], uniqueKana[j]] = [uniqueKana[j], uniqueKana[i]];
  }
  return uniqueKana
}
