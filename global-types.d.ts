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
