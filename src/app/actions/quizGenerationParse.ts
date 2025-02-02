import { ChatTypeValue } from "../utils/const";
import { shuffleArray } from "../utils/fns";
import { convertJpnToFurigana } from "../utils/jpn";

/**
 * 处理動詞题目生成的内容
 * @param content {string} - prompt
 */
export async function handleDooshiOutput(content: string) {
  if (content.length < 20) {
    return { error: "generate too short" };
  }
  let questionTitle = "";
  let questionOptionsText = "";
  let questionOptions: string[] = [];
  let questionExplanation = "";
  let questionAnswer = "";

  // match title
  const reg1 = /考题：([\s\S]+?)选项/;
  const match1 = reg1.exec(content);
  if (match1) {
    const c = match1[1].trim();
    questionTitle = c;
  }

  // match options
  const reg2 = /选项：([\s\S]+?)解释/;
  const match2 = reg2.exec(content);
  if (match2) {
    const c = match2[1].trim();
    questionOptionsText = c;
  }

  // match explanation
  const reg3 = /解释：([\s\S]+)/;
  const match3 = reg3.exec(content);
  if (match3) {
    const c = match3[1].trim();
    questionExplanation = c;
  }

  // match answer
  const reg4 = /正确答案：([\s\S]+?)这句话的意思/;
  const match4 = reg4.exec(content);
  if (match4) {
    const c = match4[1].trim().replace(/#|\n+/g, "");
    questionAnswer = c.trim();
  }

  // split each options
  const reg5 = /^[A-D]\. .+/gm;
  const match5 = questionOptionsText.match(reg5);
  if (match5 && match5.length) {
    questionOptions = match5.map((o) => o.replace(/^[A-D\.] /, "").trim());
  }

  // below regex can match hirakara,katakana and kanji
  // [\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+

  return {
    questionTitle,
    questionOptions,
    questionExplanation,
    questionAnswer,
    questionOptionsText,
  };
}

/**
 * 处理 Moji quiz题目生成的内容
 * @param content {string} - generated content
 * @param answer {object} - answer object
 * @param answer.mojiKey {string} - ChatTypeValue.N2MojiX
 */
export async function handleKanjiOutput(
  content: string,
  answer: { kanji: string; kana: string },
  mojiKey: string
) {
  // remove unexpected characters
  content = content.replace(/#|\*/g, "");
  console.warn("handleKanjiOutput content", content);
  let questionTitle = "";
  let questionOptions: string[] = [];
  let questionExplanation = "";
  let questionAnswer = answer.kana;
  const questionAnswerKanji = answer.kanji;

  // match title
  const reg1 = /题目：([\s\S]+?)句子翻译/;
  const match1 = reg1.exec(content);
  if (match1) {
    const c = match1[1].trim();
    const r = new RegExp(`(${questionAnswer}|${questionAnswerKanji})`);
    questionTitle = c.replace(r, `<b><u>$1</u></b>`);
  }

  // match answer explanation
  const reg2 = /句子翻译：([\s\S]+)/;
  const match2 = reg2.exec(content);
  if (match2) {
    const c = match2[1].trim();
    questionExplanation = c;
  }

  // match options
  const reg3 = /(其他类似的单词：([\s\S]+))|(选项：([\s\S]+))/;
  const match3 = reg3.exec(content);
  if (match3) {
    const c = (match3[2] || match3[4]).trim();
    let reg4 = /^\d\.\s*(.*)[。:-]/gm;
    const matchedLines: string[] = [];
    let m: RegExpExecArray | null;
    // let _match: RegExpExecArray | [] = [];
    // const r = new RegExp("");
    if (mojiKey === ChatTypeValue.N2Moji1) {
      // 边界情况
      // 其他类似的单词：  
      // 1.  取引 (とりひき)  交易  
      reg4 = /^\d\.\s*(.*)[。:-]|\d\.\s*[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+\s*\(.*\)[。:]?/gm;

      // match option's hirakara
      // r = new RegExp(
      //   /[\u3040-\u30ff\u3400\u9fff\uf900-\ufaff\uff66-\uff9f]+/,
      //   "g"
      // );
    } else if (
      mojiKey === ChatTypeValue.N2Moji2 ||
      mojiKey === ChatTypeValue.N2Moji3
    ) {
      // r = new RegExp(
      //   /[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+[\s\S+]-/,
      //   "gm"
      // );
    }
    while ((m = reg4.exec(c)) !== null) {
      // _match = r.exec(m[1]) || [];
      // matchedLines.push((_match[0] || m[1]).trim().replace(/-|\s+/g, ""));
      matchedLines.push(m[1].trim().replace(/ - .*|。|：|:/g, ""));
    }

    if (mojiKey === ChatTypeValue.N2Moji1) {
      questionOptions = shuffleArray([...matchedLines, questionAnswer]);
    } else if (
      mojiKey === ChatTypeValue.N2Moji2 ||
      mojiKey === ChatTypeValue.N2Moji3
    ) {
      questionOptions = shuffleArray([...matchedLines]);
    }
  }

  if (mojiKey === ChatTypeValue.N2Moji2 || mojiKey === ChatTypeValue.N2Moji3) {
    // match answer
    const reg5 = /\d\.\W+最接近/g;
    const match5 = reg5.exec(content);
    if (match5) {
      const c = match5[0].trim();
      const reg6 =
        /[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+[\s\S+]-/g;
      const match6 = reg6.exec(c);
      if (match6) {
        const ans = match6[0].trim().replace(/-|\s+/g, "");
        questionAnswer = ans;
        if (mojiKey === ChatTypeValue.N2Moji2) {
          questionOptions = shuffleArray([...questionOptions, questionAnswer]);
        }
      }
    }
    // remove answer item from options
    if (mojiKey === ChatTypeValue.N2Moji2) {
      const answerIdx = questionOptions.findIndex(
        (aa) => aa.indexOf("最接近") > -1
      );
      questionOptions.splice(answerIdx, 1);
    }
  }

  // 汉字题(Moji1)题目不需要转成hiragana，不然等于答案直接显示了
  if (mojiKey !== ChatTypeValue.N2Moji1) {
    // transfer question title to hiragana
    questionTitle = await convertJpnToFurigana(questionTitle);
  }

  return {
    questionTitle,
    questionOptions,
    questionExplanation,
    questionAnswer,
  };
}

/**
 * 处理文法排序题题目生成的内容
 * @param content {string} - generated content
 */
export async function handleBunpooOutput(content: string) {
  // remove unexpected characters
  content = content.replace(/#|\*/g, "");
  let questionTitle = "";
  const questionOptions: string[] = [];
  let questionExplanation = "";
  const questionAnswerArr: number[] = [];

  console.warn('handleBunpooOutput content', content);
  // match title
  const reg1 = /题目[:：]\s{0,}(.+)/g;
  const match1 = reg1.exec(content)
  if (match1) {
    const c = match1[1].trim();
    questionTitle = c;
  }

  // match options
  const reg2 = /选项[:：]([\s\S]+?)答案/g;
  const match2 = reg2.exec(content);
  if (match2) {
    const c = match2[0].trim();
    const optionsText = c.replace(/答案|#|\n|：|:/g, "").trim();
    const reg3 =
      /[0-9]+\.\s+[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+/gm;
    let m;
    while ((m = reg3.exec(optionsText)) !== null) {
      m.forEach((match) => {
        questionOptions.push(match.replace(/\d|\.|-|\s+/g, ""));
      });
    }

    console.warn("kekeke questionOptions", questionOptions);
  }

  // match answers
  const reg4 = /\d-\d-\d-\d/g;
  const match4 = reg4.exec(content);
  if (match4) {
    const c = match4[0].trim();
    c.split("-").forEach((match) => {
      questionAnswerArr.push(Number(match));
    });
  }

  // match answer explanation
  const reg5 = /答案[:：]([\s\S]+)/gm;
  const match5 = reg5.exec(content);
  if (match5) {
    const c = match5[1].trim();
    questionExplanation = c;
  }

  return {
    questionTitle,
    questionOptions,
    questionExplanation,
    questionAnswerArr,
    questionAnswer: "",
  };
}
