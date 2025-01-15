"use client";

export function historyBack() {
  if (typeof window !== "undefined") {
    window.history.back();
  }
}

/**
 * Pushes a new hash to the browser's history.
 *
 * @param hash - The hash to be added to the URL.
 */
export function historyPushHash(hash: string) {
  if (typeof window !== "undefined") {
    const queryString = window.location.search;

    let s = "";
    if (queryString) {
      s += `?${queryString}`;
    }
    window.history.pushState(null, "", `${queryString}#${hash}`);
  }
}
