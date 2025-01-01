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

type TKanjiDialogType = "frame" | "viewed" | "fav"

type TFavKanji = {
  id?: number;
  kanji: string;
  kana: string;
  hirakana?: string;
  type: EFavKanjiType;
};
