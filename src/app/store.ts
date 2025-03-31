import { configureStore } from "@reduxjs/toolkit";
import kanjiReducer from "@/app/kanji/kanjiSlice";
import mojiReducer from "@/app/moji/mojiSlice";
import moji1Reducer from "@/app/moji-1/moji1Slice";
import moji3Reducer from "@/app/moji-3/moji3Slice";
import quizHistoryReducer from "@/app/store/quizHistorySlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "kanji/updateLevel",
          "moji/updateLevel",
          "moji1/updateLevel",
          "moji3/updateLevel",
        ],
        ignoredPaths: [
          "kanji.level",
          "moji.level",
          "moji1.level",
          "moji3.level",
        ],
        ignoredActionPaths: [
          "kanji.level",
          "moji.level",
          "moji1.level",
          "moji3.level",
        ],
      },
    }),
  reducer: {
    kanji: kanjiReducer,
    moji: mojiReducer,
    moji1: moji1Reducer,
    moji3: moji3Reducer,
    quizHistory: quizHistoryReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
