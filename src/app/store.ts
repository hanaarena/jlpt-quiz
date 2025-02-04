import { configureStore } from '@reduxjs/toolkit'
import kanjiReducer from './kanji/kanjiSlice'
import mojiReducer from './moji/mojiSlice'
import moji1Reducer from './moji-1/moji1Slice'

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['kanji/updateLevel', 'moji/updateLevel', 'moji1/updateLevel'],
      ignoredPaths: ['kanji.level', 'moji.level', 'moji1.level'],
      ignoredActionPaths: ['kanji.level', 'moji.level', 'moji1.level'],
    }
  }),
  reducer: {
    kanji: kanjiReducer,
    moji: mojiReducer,
    moji1: moji1Reducer,
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store