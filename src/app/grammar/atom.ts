import { atom } from "jotai";
import type { TGrammarDataset } from "@/data/grammarV2";
import { GrammarSTAGE } from "../types";

const initDataasetAtom = atom<TGrammarDataset>("v1");
export const datasetAtom = atom<TGrammarDataset, [TGrammarDataset], any>(
  (get) => get(initDataasetAtom),
  (_, set, update) => {
    set(initDataasetAtom, update);
    return update;
  }
);

export type TGrammarFavProperty = {
  id: number;
  level: string;
  key: string;
  meaning: string;
  example: string;
  createdAt: Date;
};
export type TGrammarFav = Record<string, TGrammarFavProperty>;
const initGrammarFavAtom = atom<TGrammarFav>({});
export const grammarFavAtom = atom<TGrammarFav, [TGrammarFav], any>(
  (get) => get(initGrammarFavAtom),
  (_, set, update) => {
    set(initGrammarFavAtom, update);
    return update;
  }
);

const initPrevStageAtom = atom<GrammarSTAGE[]>([]);
export const prevStageAtom = atom<GrammarSTAGE[], [GrammarSTAGE[]], any>(
  (get) => get(initPrevStageAtom),
  (_, set, update) => {
    set(initPrevStageAtom, update);
    return update;
  }
);
