"use client";

/**
 * 修改主题色
 * @param color {string}
 */
export function changeThemeColor(color: string) {
  let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
  
  // If the meta tag exists, update the color
  if (themeColorMetaTag) {
    themeColorMetaTag.setAttribute('content', color);
  } else {
    // If the meta tag doesn't exist, create one
    themeColorMetaTag = document.createElement('meta');
    themeColorMetaTag.setAttribute('name', 'theme-color');
    themeColorMetaTag.setAttribute('content', color);
    document.head.appendChild(themeColorMetaTag);
  }
}