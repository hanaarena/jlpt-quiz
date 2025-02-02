# Exceed JLPT

This project a set of JLPT quizes for learning Japanese.

## Cloudflare Workers -> Pages

由于 Workers 有构建文件（zip）大小限制（3M），随着开发的进行，Node.js 的依赖包用的也会越多。可预期的未来里，非常容易超过这个限制。所以，需要将 Workers 部署到 Pages 上。

## 各页面 Header 组件(SVG shape generator)

### tool

- https://getwaves.io/
- https://www.svgbackgrounds.com/elements/svg-shape-dividers/
- https://svgwave.in/
- https://app.haikei.app/
- https://www.svgshapes.in/

### 🌟 SVG Path Editor

https://yqnn.github.io/svg-path-editor/

## Framer-motion 动画集

- https://framermotionexamples.com/examples?s=line_drawing

## Cloudflare Workers

``dev`` 推送时会触发 Github action 自动构建并部署到 Cloudflare Workers Preview 环境。

``main`` 推送时会触发 Cloudflare Workers Deployment，即 CF 的构建部署。

## Wrangler Configuration

https://developers.cloudflare.com/workers/wrangler/configuration/