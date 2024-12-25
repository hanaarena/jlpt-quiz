export function getSession(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const session = localStorage.getItem(key);
  if (!session) {
    return null;
  }
  return JSON.parse(session);
}

export function setSession(key: string, value: any) {
  if (typeof window === "undefined") {
    return null;
  }
  localStorage.setItem(key, JSON.stringify(value));
}
