import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EJLPTLevel } from "@/app/types";
import { RootState } from "@/app/store";
import { setStorage } from "@/app/utils/localstorage";

export const LevelKey = "moji1-level";

const initialState = {
  level: new Set([]) as Set<EJLPTLevel>,
};

export const moji1Slice = createSlice({
  name: "moji1",
  initialState,
  reducers: {
    updateLevel: (state, action: PayloadAction<Set<EJLPTLevel>>) => {
      state.level = action.payload;
      const arr = Array.from(action.payload);
      setStorage(LevelKey, JSON.stringify(arr));
    },
  },
});

export const { updateLevel } = moji1Slice.actions;

export const selectorLevel = (state: RootState) => state.moji1.level;

export default moji1Slice.reducer;
