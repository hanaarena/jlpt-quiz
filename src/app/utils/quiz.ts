/**
 * shuffle and remove duplicated options & renew answer
 * @param optionStr {string} - original options string
 * @param answer {string} - original answer
 * @returns [options: string[], answer: string]
 * @description
 * original options:
 * A.あああ
 * B.いいい
 * C.ううう
 * D.えええ
 *
 * into:
 * A.いいい
 * B.あああ
 * C.えええ
 * D.ううう
 */
export function shuffleOptions(
  optionStr: string,
  answer: string
): [string[], string] {
  const optionTitles = ["A", "B", "C", "D"];
  let ans = answer.replace(/\s+/g, "");
  let opts = optionStr.split("\n").map((opt) => opt?.replace(/\s+/g, ""));
  // remove duplicate and empty options
  opts = opts.filter((opt, index) => opts.indexOf(opt) === index && opt);
  // shuffle options array
  const array = [...opts];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i].replace(/[a-d]\.\s?(.+)+/gi, `${optionTitles[i]}.$1`));
  }

  // find answer index in new shuffled result array
  const _ans = ans.replace(/[a-d]\./gi, "");
  const findIndex = array.findIndex((a) => {
    const r = a.match(/^[a-d]\.(.*)/i);
    return r && r[1] === _ans;
  });

  ans = `${optionTitles[findIndex]}.${_ans}`;
  return [result, ans];
}
