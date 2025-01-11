import { atom } from "jotai";
import type { TGrammarDataset } from "../data/grammarV2";

const initDataasetAtom = atom<TGrammarDataset>("v1");
export const datasetAtom = atom<TGrammarDataset, [TGrammarDataset], any>((get) => get(initDataasetAtom),  (_, set, update) => {
  set(initDataasetAtom, update);
  return update;
});
