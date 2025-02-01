import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EJLPTLevel } from "@/app/types";
import { RootState } from "@/app/store";
import { setStorage } from "@/app/utils/localstorage";

export const LevelKey = "kanji-level";
export const CountKey = "kanji-words-count";

const initialState = {
  level: new Set([]) as Set<EJLPTLevel>,
  count: 0,
};

export const kanjiSlice = createSlice({
  name: "kanji",
  initialState,
  reducers: {
    updateLevel: (state, action: PayloadAction<Set<EJLPTLevel>>) => {
      state.level = action.payload;
      const arr = Array.from(action.payload);
      setStorage(LevelKey, JSON.stringify(arr));
    },
    updateCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
      setStorage(CountKey, action.payload);
    },
  },
});

export const { updateLevel, updateCount } = kanjiSlice.actions;

// The function below is called a `selector` and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectorLevel = (state: RootState) => state.kanji.level;
export const selectorCount = (state: RootState) => state.kanji.count;

export default kanjiSlice.reducer;
