import { configureStore } from '@reduxjs/toolkit'
import kanjiReducer from './kanji/kanjiSlice'

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['kanji/updateLevel'],
      ignoredPaths: ['kanji.level'],
      ignoredActionPaths: ['kanji.level'],
    }
  }),
  reducer: {
    kanji: kanjiReducer,
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store