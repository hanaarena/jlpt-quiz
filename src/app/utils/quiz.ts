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

interface IRubyContent {
  rb: string;
  rt: string;
}

function pickRbAndRt(htmlString: string): IRubyContent {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const rbElement: Element | null = doc.querySelector("rb");
  const rtElement: Element | null = doc.querySelector("rt");

  const rbText: string = rbElement?.textContent ?? "";
  const rtText: string = rtElement?.textContent ?? "";

  return {
    rb: rbText,
    rt: rtText,
  };
}

export function highlightKeyword(
  questionText: string,
  questionHTML: string,
  keyword: string,
  selector: string
) {
  let result = questionHTML;
  const pickKeyword = questionText.match(/<u>([\s\S]*?)<\/u>/);
  console.warn("kekek pickKeyword", pickKeyword);
  if (pickKeyword && pickKeyword[1]) {
    result = result.replace(
      new RegExp(pickKeyword[1]),
      `<span class="bg-yellow-400/80">${pickKeyword[1]}</span>`
    );
  }

  // if keyword only consist of kanji or furigana
  if (result !== questionHTML) {
    return result;
  }

  // split by `<ruby>`
  const rubyRegex = /(<ruby[^>]*>.*?<\/ruby>)/;
  const parts = questionHTML.split(rubyRegex);
  // find target word inside ruby tag -> kanji + furigana
  let targetWordObj: IRubyContent = { rb: "", rt: "" };
  for (const r of parts) {
    if (r.indexOf("<ruby>") > -1) {
      const obj = pickRbAndRt(r);
      if (keyword.includes(obj.rb) || keyword.includes(obj.rt)) {
        targetWordObj = obj;
        break;
      }
    }
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(questionHTML, "text/html");
  const container = doc.querySelector(selector);
  if (!container) return questionHTML;

  const targetRb = targetWordObj.rb;
  const targetRt = targetWordObj.rt;
  const reg = new RegExp(`${targetRb}|${targetRt}|\\s+|[a-d]+|\\.+`, "gi");
  const targetFollowingText = keyword.replaceAll(reg, "");
  const childNodes = Array.from(container.childNodes);

  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as Element;

      if (elementNode.tagName === "RUBY") {
        const rb = elementNode.querySelector("rb");
        const rt = elementNode.querySelector("rt");

        if (
          rb &&
          rb.textContent === targetRb &&
          rt &&
          rt.textContent === targetRt
        ) {
          const nextNode = childNodes[i + 1];

          if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
            const text = nextNode.nodeValue || "";

            if (text.trimStart().startsWith(targetFollowingText)) {
              const highlightSpan = document.createElement("span");
              highlightSpan.className = "bg-yellow-400/80";

              const whitespaceMatch = text.match(/^\s*/);
              const leadingWhitespace = whitespaceMatch
                ? whitespaceMatch[0]
                : "";
              if (leadingWhitespace) {
                nextNode.nodeValue = leadingWhitespace;
              } else {
                nextNode.nodeValue = "";
              }

              highlightSpan.appendChild(node);
              const gashiTextNode =
                document.createTextNode(targetFollowingText);
              highlightSpan.appendChild(gashiTextNode);
              container.insertBefore(highlightSpan, nextNode);
              const remainingText = text.substring(
                leadingWhitespace.length + targetFollowingText.length
              );
              nextNode.nodeValue = remainingText;
            }
          }
        }
      }
    }
  }

  result = container.innerHTML;
  return result;
}
