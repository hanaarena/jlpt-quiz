declare module "kuroshiro";
declare module "kuroshiro-analyzer-kuromoji";
declare module "godan-ichidan";
declare module "canvas-confetti";

interface IDooshiGenerationResult {
  questionTitle: string;
  questionOptions: string[];
  questionExplanation: string;
  questionAnswer: string;
  questionAnswerArr?: number[];
  questionOptionsText?: string;
  text?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

type TFavKanji = {
  id?: number;
  kanji: string;
  kana: string;
  hirakana?: string;
  type: EFavKanjiType;
  createdAt?: string;
};

interface IMoji1Quiz {
  keyword: string;
  question: string;
  options: string[];
  answer: string;
  furigana: string;
  translation: string;
}

interface IMoji3Quiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  translation: string;
}
