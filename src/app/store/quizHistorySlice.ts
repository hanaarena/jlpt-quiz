import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizItem<T> {
  quiz: T;
  answer: string;
}

interface QuizHistoryState<T> {
  history: QuizItem<T>[];
  currentIndex: number;
}

type QuizType =
  | IMoji1Quiz
  | IMoji3Quiz

const initialState: QuizHistoryState<QuizType> = {
  history: [],
  currentIndex: -1,
};

const quizHistorySlice = createSlice({
  name: "quizHistory",
  initialState,
  reducers: {
    addQuizToHistory: (state, action: PayloadAction<QuizItem<QuizType>>) => {
      console.warn('kekeke state', state);
      if (state.currentIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.currentIndex + 1);
      }
      state.history.push(action.payload);
      state.currentIndex++;
    },
    goToPreviousQuiz: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
      }
    },
    goToNextQuiz: (state) => {
      if (state.currentIndex < state.history.length - 1) {
        state.currentIndex++;
      }
    },
    updateCurrentAnswer: (state, action: PayloadAction<string>) => {
      if (state.currentIndex >= 0 && state.currentIndex < state.history.length) {
        state.history[state.currentIndex].answer = action.payload;
      }
    },
    resetQuizHistory: (state) => {
      state.history = [];
      state.currentIndex = -1;
    },
  },
});

export const {
  addQuizToHistory,
  goToPreviousQuiz,
  goToNextQuiz,
  updateCurrentAnswer,
  resetQuizHistory,
} = quizHistorySlice.actions;

export const selectQuizHistory = <T = any>(state: any): QuizItem<T>[] => state.quizHistory?.history || [];
export const selectCurrentIndex = (state: any): number => state.quizHistory?.currentIndex || -1;
export const selectCurrentQuiz = <T = any>(state: any): QuizItem<T> | null => {
  const quizHistory = state.quizHistory;
  if (
    quizHistory &&
    quizHistory.history &&
    quizHistory.currentIndex >= 0 &&
    quizHistory.currentIndex < quizHistory.history.length
  ) {
    return quizHistory.history[quizHistory.currentIndex] as QuizItem<T>;
  }
  return null;
};

export default quizHistorySlice.reducer;
