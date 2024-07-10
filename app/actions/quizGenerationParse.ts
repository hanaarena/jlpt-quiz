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
 * 处理kanji/hirakara题目生成的内容
 * @param content {string} - prompt
 */
export async function handleKanjiOutput(content: string) {
  console.warn('kekeke content', content);
  return content
}
