import { EJLPTLevel } from "../types";

export const ChatTypeValue = {
  N2Dooshi: "N2-dooshi",
  N2Bunpoo: "N2-bunpoo",
  N2Moji1: "N2-moji1", // 发音(漢字→ひらがな、ひらがな→漢字)
  N2Moji2: "N2-moji2", // 相似词意(找出与句子中的划线词汇相近意思的选项)
  N2Moji3: "N2-moji3", // 最佳选项（填入符合句意的选项）
  N2Verb: "N2-verb-conjugation", // 动词变形训练题
  Grammar: "grammar", // N1-5语法题
  N2KanjiExample: "N2-kanji-example", // N2 汉字意义+例句生成
};

export const items = [
  {
    id: 1,
    name: "動詞活用",
    key: ChatTypeValue.N2Dooshi,
    cx: "bg-blue-400 text-white hover:bg-blue-500",
    active: "bg-blue-500",
  },
  {
    id: 2,
    name: "文法·排序题",
    key: ChatTypeValue.N2Bunpoo,
    cx: "bg-indigo-400 text-white hover:bg-indigo-500",
    active: "bg-indigo-500",
  },
  {
    id: 0,
    name: "文字·語彙",
    cx: "bg-green-500 text-white hover:bg-green-600",
    active: "bg-green-600",
    children: [
      {
        id: 3,
        name: "漢字/hiragana",
        key: ChatTypeValue.N2Moji1,
      },
      {
        id: 4,
        name: "相似词意",
        key: ChatTypeValue.N2Moji2,
      },
      {
        id: 5,
        name: "最佳选项",
        key: ChatTypeValue.N2Moji3,
      },
    ],
  },
  {
    id: 6,
    name: "动词普通形",
    key: ChatTypeValue.N2Bunpoo,
  },
];

export function findItemByid(id: number) {
  return (
    items.find((item) => item.id === id) ||
    items.map((item) => {
      const found = item.children?.find((child) => child.id === id);
      if (found) {
        return found;
      }
    }).filter(i => i)[0]
  );
}

export type ChatType = keyof typeof systemMessage;

export const systemMessage = {
  [ChatTypeValue.N2Dooshi]: {
    prompt: `
    I will provide a specific Japanese word. You can use the provided word, either in its original form or by conjugating it. Please note the following rules:
    1. There needs to be a line break between the question and the answer options.
    2. The options can provide other conjugated forms of the target word or its original form.
    3. If the specified word is a verb, the answer explanation must state the verb's type (e.g., Group 1 verb, etc.). If it's an adjective, it must indicate whether it's a *na*-adjective or an *i*-adjective.
    4. This exercise focuses on testing Japanese verb conjugations.
    5. The question should return the ruby format.
    6. Don't forget use the '<mm>' tag to wrap the content

    Below is the output format:

    keyword： <mm>立てる</mm>
    [sperator]
    question: <mm><div class="question-moji"><ruby><rb>彼</rb><rp>(</rp><rt>かれ</rt><rp>)</rp></ruby>は<ruby><rb>新</rb><rp>(</rp><rt>あたら</rt><rp>)</rp></ruby>しい<ruby><rb>会社</rb><rp>(</rp><rt>かいしゃ</rt><rp>)</rp></ruby>を＿＿＿＿ことに<ruby><rb>成功</rb><rp>(</rp><rt>せいこう</rt><rp>)</rp></ruby>した。</div></mm> 
    [sperator]
    options：  
      <mm>A. 立てる  
      B. 立てた  
      C. 立てよう  
      D. 立てられる</mm>
    [sperator]
    Correct Answer: <mm>B. 立てた</mm>
    [sperator]
    Explanation:
    <mm>This question tests the past tense conjugation of "たてる" . "たてる" is a Group 1 verb, meaning "to build," "to establish," or "to found."
    This sentence means: "He successfully established a new company."(他成功建立了一家新公司)</mm>
    [sperator]
    Explanation of options:
    <mm>·立てる: This is the dictionary form (plain form), indicating the present tense or imperative mood.
    ·立てよう: This expresses intention or volition, which doesn't fit the meaning of the sentence.
    ·立てられる: This is the passive form, which doesn't fit the meaning of the sentence.
    ·立てた: This is the plain past tense form (た-form) of the Group 2 verb 立てる</mm>`,
    name: "N2动词变形题",
  },
  [ChatTypeValue.N2Bunpoo]: {
    prompt: `
    以下是一道JLPT 日本语能力考试真题：
    子供のころは、年が長く感じられたのに、年をとる__ __ __ __だろうか。
    1.のは 2.につれて 3.なぜ 4.短く感じるようになる
    这道题需要我们将题干中的四个"__"分别填上正确的序号，比如上面这道题的正确答案顺序是：2-4-1-3，完整的句子为：子供のころは、年が長く感じられたのに、年をとるにつれて 短く感じるようになる のは なぜだろうか。
    请仿照以上的题目类型，并按以下要求输出内容：
    1.结合JLPT 日本语能力考试所涉及的日语动词、文法等等语料;
    2.给出题目的同时请翻译完整的句子，如果可以的话给出各个选项的解释;
    3.给出正确答案的顺序;
    4.请使用中文输出回答并按以下格式输出答案;
    5.选项前面一定要输出“选项”;
    以下是一个完整的输出例子：
    题目：
    疲れたときに、甘いものを食べる人は多いですが、実は、甘いものを食べ過ぎると、__ __ __ __ 体に悪影響があるかもしれません。
    选项：1.ことは 2. 逆に 3. よく 4. 知られていない
    答案：
    2-4-1-3 (疲れたときに、甘いものを食べる人は多いですが、実は、甘いものを食べ過ぎると、逆に よく 知られていない ことは 体に悪影響があるかもしれません。)
    翻译：
    虽然很多人在疲倦的时候会吃甜食，但实际上，过度食用甜食，反而可能对身体造成一些不为人知的负面影响。
    选项解释：
    2. 逆に： 表示相反的意思，与前文“疲れたときに、甘いものを食べる人は多い”形成对比，引出后文“体に悪影響がある”的论点。
    4. よく 知られていない： 表示“不为人知”，强调甜食过度食用对身体的负面影响，并非大众所熟知。
    1. ことは： 连接词，将“甘いものを食べ過ぎると、逆に よく 知られていない”与“体に悪影響がある”连接起来，使句子完整。
    3. 体に悪影響がある： 表达“对身体有负面影响”，承接前文“逆に よく 知られていない”的内容，揭示甜食过度食用的弊端。
    解题思路：
    这道题考察了考生对日语连接词、副词以及句子结构的理解。
    首先，根据“実は”和“逆に”的提示，可以判断出该句子表达了与前文相反的意思。
    其次，“よく 知られていない”强调了甜食过度食用的负面影响并非大众所熟知，这也是解题的关键。
    最后，通过“ことは”将“甘いものを食べ過ぎると、逆に よく 知られていない”与“体に悪影響がある”连接起来，使句子完整。
    `,
    name: "N2语法·排序题",
  },
  [ChatTypeValue.N2Moji1]: {
    prompt: `
    I will provide a specific Japanese vocabulary word. Please create a sentence based on the given Japanese word, and also provide three other similar Japanese words. Please follow these rules:
    1.There should be a line break between the question and the answer options;
    2.The 'options' should only in hiragana and must included correct pronunciation of keyword
    3.The 'translation' should include english and Simplified chinese version
    Below is the output format:

    keyword： <mm>貧しい</mm>
    [sperator]
    question：<mm>戦後、日本は<u>貧しい</u>時代を経験した。</mm> 
    [sperator]
    options：  
      <mm>A. きびしい
      B. まずしい
      C. けわしい
      D. はげしい</mm>
    [sperator]
    Correct Answer: <mm>B.まずしい</mm>
    [sperator]
    HTML
    <mm><div class="question-moji-1"><ruby><rb>戦後</rb><rp>(</rp><rt>せんご</rt><rp>)</rp></ruby>、<ruby><rb>日本</rb><rp>(</rp><rt>にっぽん</rt><rp>)</rp></ruby>は<ruby><rb>貧</rb><rp>(</rp><rt>まず</rt><rp>)</rp></ruby>しい<ruby><rb>時代</rb><rp>(</rp><rt>じだい</rt><rp>)</rp></ruby>を<ruby><rb>経験</rb><rp>(</rp><rt>けいけん</rt><rp>)</rp></ruby>した</div></mm>
    [sperator]
    Translation:
    <mm>After the war, Japan experienced a period of poverty.<br>
    战后，日本经历了贫困的时期。</mm>
    `,
    name: "N2文字·語彙·1",
  },
  [ChatTypeValue.N2Moji2]: {
    prompt: `
    我将给出一个特定的日语词汇,请根据给出的日语词汇造句，并给出与之相似的四个其他日语单词。请注意一下几个规则：
    1. 考题和答案选项之间需要有换行;
    2. 请使用中文输出结果;
    3. 输出其他类似的单词时请使用与关键词类似的动词或者形容词，并且告诉我最接近的是哪个单词;
    以下句子的关键词是「単なる」，以下是一个完整的输出例子：
    题目：田中さんは単なる友人です。

    句子翻译：田中先生只是一个朋友。
    其他类似的单词：
    1. 大切な - 重要的。
    2. 一生の - 一生的。
    3. ただの - 纯粹的。
    4. 唯一の - 唯一的。 (最接近)
    `,
    name: "N2文字·語彙·2",
  },
  [ChatTypeValue.N2Moji3]: {
    prompt: `
    When I sent you "hoolala", please random Japanese vocabulary word. Please use the given Japanese vocabulary word to create a sentence. Please follow these rules:

    1.There needs to be a line break between the question and the answer options.
    2.The blank space should remain empty; do not fill it with anything.
    3.The 'options' should only be in hiragana.
    4.Don't forget use the '<mm>' tag to wrap the content

    Below is a complete example of the output:

    question：<mm><div class="question-moji-3"><ruby><rb>新</rb><rp>(</rp><rt>あたら</rt><rp>)</rp></ruby>しいれすとらんを<ruby><rb>見</rb><rp>(</rp><rt>み</rt><rp>)</rp></ruby>つけた______、とても<ruby><rb>人気</rb><rp>(</rp><rt>にんき</rt><rp>)</rp></ruby>があるようだった。</div></mm>
    [sperator]
    options:<mm>
    A.ところに
    B.ために
    C.はずで
    D.ばかりに
    </mm>
    [sperator]
    answer: <mm>A.ところに</mm>
    [sperator]
    translation:<mm>Just as I found a new restaurant, it seemed to be very popular.
    我刚找到一家新餐厅，它似乎很受欢迎。</mm>
    [sperator]
    option's explanation: <mm>
    ·ところに: Expresses the timing of an event happening. It means "just when," "at the moment of," or "in the process of."
    ·ために: Means "in order to" or "because of." It indicates purpose or reason.
    ·はずで: Means "it should be" or "it was supposed to be." It expresses expectation or certainty about something.
    ·ばかりに: Means "only because" or "just because." It implies regret or negative consequence due to a particular reason.
    </mm>
    `,
    name: "N2文字·語彙·3",
  },
  [ChatTypeValue.Grammar]: {
    prompt: `
    给定一个日语词汇，随机生成长度相近且与关键词意思不相关的语法词汇或短语，请直接输出结果（4个选项即可），返回结果请符合下列要求：
    1.请一行一个选项返回;
    2.结果中请不要带其他介绍性的句子或多余的字符;
    3.每行选项长度也可以跟下面的关键词长度一致;

    てくれ
    以下是一个完整的输出例子：
    だろう
    から
    ことにする
    ように
    `
  },
  [ChatTypeValue.N2KanjiExample]: {
    prompt: `
    I will give the keyword of japanese,please generate two examples of this word, also output the translate of these examples with english and chinese. Below is the output format:

    <p class="text-2xl bold">起きる (Verb - 自動詞)</p>
    "to wake up," "to get up," "to occur," or "to happen." “醒来”，“起床”，“发生”

    Examples:

    - 毎朝6時に起きます。
      I wake up at 6 a.m. every morning.
      我每天早上六点起床。

    - 地震が起きた時、私は家にいました。
      I was at home when the earthquake happened.
      地震发生时，我在家里。
    `
  }
};

// 动词变形类型map
export const VerbTypeMap = {
  dictionary: "辞書形",
  negative: "否定形",
  ta: "過去形",
  taNai: "過去否定形",
  potential: "可能形",
  imperative: "命令形",
  volitional: "意志形",
  passive: "受身形",
  causative: "使役形",
  causativePassive: "使役受身形",
  conditional: "条件形",
};

// include N1,N2, N3
export const LevelList = Object.values(EJLPTLevel)
  .filter((level) => Number(level.slice(1)) > 0 && Number(level.slice(1)) <= 3)
  .map((level) => {
    return {
      label: level,
      value: level,
    };
  });
