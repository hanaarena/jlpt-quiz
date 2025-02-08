import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EJLPTLevel } from "@/app/types";
import { RootState } from "@/app/store";
import { setStorage } from "@/app/utils/localstorage";

export const LevelKey = "moji3-level";

const initialState = {
  level: new Set([]) as Set<EJLPTLevel>,
};

export const moji3Slice = createSlice({
  name: "moji3",
  initialState,
  reducers: {
    updateLevel: (state, action: PayloadAction<Set<EJLPTLevel>>) => {
      state.level = action.payload;
      const arr = Array.from(action.payload);
      setStorage(LevelKey, JSON.stringify(arr));
    },
  },
});

export const { updateLevel } = moji3Slice.actions;

export const selectorLevel = (state: RootState) => state.moji3.level;

export default moji3Slice.reducer;
