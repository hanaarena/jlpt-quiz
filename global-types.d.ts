interface IDooshiGenerationResult {
  questionTitle: string;
  questionOptions: string[];
  questionExplanation: string;
  questionAnswer: string;
  questionOptionsText: string;
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
