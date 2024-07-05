import { atom } from "jotai";

// type id
export const questionTypeAtom = atom(0);
// question key JLPT word
export const questionKeywordAtom = atom("");
export const quetionContentAtom = atom(async (get, { signal }) => {
  // const type = get(questionTypeAtom);
  // if (type) {
  //   // todo: call Gemini
  //   const d = randomDooshiKana();
  //   const { kana, kanji } = d;
  //   // todo: pick first random question by question's type

  //   // submitUserMessage({content: `${kana}${kanji ? `(${kanji})` : ''}`, chatType: ChatTypeValue.N2Dooshi})
  //   // const response = await fetch(
  //   //   `https://jsonplaceholder.typicode.com/users/${type}?_delay=2000`,
  //   //   { signal }
  //   // );
  //   // return response.json();
  // } else {
  //   return {};
  // }
});
