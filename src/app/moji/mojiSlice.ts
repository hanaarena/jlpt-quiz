import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EJLPTLevel } from "@/app/types";
import { RootState } from "@/app/store";
import { setStorage } from "@/app/utils/localstorage";

export const LevelKey = "moji-level";

const initialState = {
  level: new Set([]) as Set<EJLPTLevel>,
};

export const mojiSlice = createSlice({
  name: "moji",
  initialState,
  reducers: {
    updateLevel: (state, action: PayloadAction<Set<EJLPTLevel>>) => {
      state.level = action.payload;
      const arr = Array.from(action.payload);
      setStorage(LevelKey, JSON.stringify(arr));
    },
  },
});

export const { updateLevel } = mojiSlice.actions;

// The function below is called a `selector` and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectorLevel = (state: RootState) => state.moji.level;

export default mojiSlice.reducer;
