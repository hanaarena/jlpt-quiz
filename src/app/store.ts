import { configureStore } from '@reduxjs/toolkit'
import kanjiReducer from './kanji/kanjiSlice'
import mojiReducer from './moji/mojiSlice'

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['kanji/updateLevel', 'moji/updateLevel'],
      ignoredPaths: ['kanji.level', 'moji.level'],
      ignoredActionPaths: ['kanji.level', 'moji.level'],
    }
  }),
  reducer: {
    kanji: kanjiReducer,
    moji: mojiReducer,
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store