import * as codec from "./kamiya.min.mjs";

import godanIchidan from "godan-ichidan";

export const auxiliaries = [
  "Potential",
  "Masu",
  "Nai",
  "Tai",
  "Tagaru",
  "Hoshii",
  "Rashii",
  "SoudaHearsay",
  "SoudaConjecture",
  "SeruSaseru",
  "ShortenedCausative",
  "ReruRareru",
  "CausativePassive",
  "ShortenedCausativePassive",
  "Ageru",
  "Sashiageru",
  "Yaru",
  "Morau",
  "Itadaku",
  "Kureru",
  "Kudasaru",
  "TeIru",
  "TeAru",
  "Miru",
  "Iku",
  "Kuru",
  "Oku",
  "Shimau",
  "TeOru",
] as const;
type TAuxiliary = (typeof auxiliaries)[number];

export const conjugations = [
  "Negative",
  "Conjunctive",
  "Dictionary",
  "Conditional",
  "Imperative",
  "Volitional",
  "Te",
  "Ta",
  "Tara",
  "Tari",
  "Zu",
] as const;
type TConjugation = (typeof conjugations)[number];

/**
 * 二类动词/一段动词检测
 * @param word
 * @returns boolean
 * @description vs/u-v 为五段动词(一类动词)
 */
function typeIIDetection(type: string) {
  // if (type.indexOf("v1") > -1) {
  //   return true
  // }

  if (godanIchidan(type) === "ichidan") {
    return true;
  }

  return false;
}

/**
 *
 * @param word
 * @param aux
 * @param conjugate
 * @param _typeII {boolean} - 原始type,v5k/v1/v5g/u-v/vs...
 * @returns
 */
export function conjugate(
  word: string,
  aux: TAuxiliary[],
  conjugate: TConjugation,
  _typeII = false
): string {
  let typeII = _typeII || typeIIDetection(word);
  const a = codec.conjugateAuxiliaries(word, aux, conjugate, typeII);

  if (a.length === 0) {
    return word;
  } else if (a.length === 1) {
    return a[0];
  } else {
    return a[a.length - 1];
  }
}
