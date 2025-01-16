"use client";

export function historyBack() {
  if (typeof window !== "undefined") {
    window.history.back();
  }
}

/**
 * Pushes a new hash to the browser's history.
 *
 * @param path - The path to be added to the URL.
 */
export function historyPushHash(path: string, obj: Record<string, any> = {}) {
  if (typeof window !== "undefined") {
    // const queryString = window.location.search;

    // let s = "";
    // if (queryString) {
    //   s += `?${queryString}`;
    // }
    window.history.pushState(obj, "", path);
  }
}

export function historyReplaceHash(path: string, obj: Record<string, any> = {}) {
  if (typeof window !== "undefined") {
    // const queryString = window.location.search;

    // let s = "";
    // if (queryString) {
    //   s += `?${queryString}`;
    // }
    window.history.replaceState(obj, "", path);
  }
}
