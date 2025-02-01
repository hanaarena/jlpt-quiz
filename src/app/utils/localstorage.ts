export const N2KanjiModeKey = "n2-kanji-mode";

export function getStorage(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const session = localStorage.getItem(key);
  if (!session) {
    return null;
  }
  return JSON.parse(session);
}

export function setStorage(key: string, value: any) {
  if (typeof window === "undefined") {
    return null;
  }
  localStorage.setItem(key, JSON.stringify(value));
}
