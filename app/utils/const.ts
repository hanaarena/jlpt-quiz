export const ChatTypeValue = {
  N2Dooshi: "N2-dooshi",
  N2Bunbo: "N2-bunbo",
};

export const items = [
  {
    id: 1,
    name: "动词选择",
    key: ChatTypeValue.N2Dooshi,
    cx: "bg-blue-400 text-white hover:bg-blue-500",
    active: "bg-blue-500",
  },
  {
    id: 2,
    name: "文法",
    key: ChatTypeValue.N2Bunbo,
    cx: "bg-indigo-400 text-white hover:bg-indigo-500",
    active: "bg-indigo-500",
  },
];

export type ChatType = keyof typeof systemMessage;

export const systemMessage = {
  [ChatTypeValue.N2Dooshi]: {
    prompt: `
    我将给出一个特定的日语词汇，可以使用所提供的词汇进行变形或者保留原形。请注意一下几个规则：
    1. 考题和答案选项之间需要有换行;
    2. 题目可以自由使用动词变形的形式;
    3. 如果指定的词汇为动词，答案解释中需给出该动词的词性,比如一类动词等等。如果是形容词，需指出是ナ形容词还是イ形容词;
    最后请使用中文输出回答并按以下格式输出答案:
    词汇： せっかく (sekkaku)
    考题：
    ＿＿＿＿準備したのに、雨が降ってきて残念だ。
    A. せっかく
    B. だから
    C. でも
    D. ので
    解释：
    这道题考察的是「せっかく」的用法。「せっかく」表示“特意…”，“好不容易…”的意思，用于表达做了某事却徒劳无功的惋惜之情。
    正确答案：A. せっかく
    这句话的意思是：特意准备了，结果下雨了，真可惜。
    其他选项的解释：
    B. だから：表示原因，与句意不符。
    C. でも：表示转折，与句意不符。
    D. ので：表示原因，与句意不符。
    `,
    name: "N2动词变形题",
  },
  [ChatTypeValue.N2Bunbo]: {
    prompt: `
    以下是一道JLPT 日本语能力考试真题：
    子供のころは、年が長く感じられたのに、年をとる__ __ __ __だろうか。
    1.のは 2.につれて 3.なぜ 4.短く感じるようになる
    这道题需要我们将题干中的四个"__"分别填上正确的序号，比如上面这道题的正确答案顺序是：2-4-1-3，完整的句子为：子供のころは、年が長く感じられたのに、年をとるにつれて 短く感じるようになる のは なぜだろうか。
    请仿照以上的题目类型，结合JLPT 日本语能力考试所涉及的日语动词、文法等等语料，给出题目的同时请翻译完整的句子，如果可以的话给你各个选项的解释。
    以下是一个完整的输出例子：
    题目：
    疲れたときに、甘いものを食べる人は多いですが、実は、甘いものを食べ過ぎると、__ __ __ __ 体に悪影響があるかもしれません。
    ことは 2. 逆に 3. よく 4. 知られていない
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
    name: "N2语法题",
  },
};
