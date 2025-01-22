<p
                                                                ⣸       ⣸⢡⠣⡣⡛⢷⣄⣠⣠⣀⡀⣀⡤⢖⢫⢙⢿⡄⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠠⡗⢕⠕⡕⡱⡑⡕⡜⡔⢕⢍⢇⢎⢎⢪⠸⡘⡧⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⣀⣴⢎⠎⡎⢎⢪⢊⢎⢪⣸⢼⣜⡔⡕⡜⡌⡎⢎⠪⡿⠀⠀⠀⠀⠀ ⠀⠀⢀⡾⠁⠉⠉⠛⠛⠓⠓⠓⠋⠉⠀⠀⠈⠙⠳⠮⣮⣼⣸⣘⣜⣤⡀⠀⠀⠀ ⠀⢠⡟⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠀⠀⠀⠀⠒⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆⠀⠀ ⠀⣾⠀⠀⠀⣠⢠⣀⠐⠚⠉⠃⠀⠀⠀⠀⠀⠒⠶⡄⠀⠀⠀⠀⠀⠀⠀⢹⡄⠀ ⠀⣷⠀⠀⠐⠃⢋⠊⠙⠁⠀⠀⣤⣠⣆⣀⠀⠀⠀⠰⢣⢮⢦⠄⠀⠀⠀⢸⡇⠀ ⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣏⢻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠅⠀ ⠀⠈⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣍⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀ ⠀⠀⠀⠙⣳⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠋⠀⠀⠀ ⠀⠀⠀⢸⣃⣠⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠓⣦⠀⠀⠀ ⠀⠀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠚⠦⠜⠃⠀⠀ ⠀⠀⠀⠀⠀⠀⠙⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡞⡞⡫⡹⣆⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠈⠙⢦⣀⡀⠀⠀⠀⠀⠀⠀⠀⣀⡠⠖⠛⠪⠎⠞⠚⠁⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠹⡄⢸⡄⢠⠏⠉⠁
>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**NOTE**

- 如果需要开发`/kanji`页面时，需要用到数据库功能时（如收藏功能），需要先启动`jlpt-quiz-server`项目
  - jlpt-quiz-server 项目地址：https://github.com/hanaarena/quiz-api-server

## Deploy

### deploy to preview environment
To deploy assets to a preview environment, run:

```bash
 pnpm pb:test
```

### deploy to production environment

```bash
npm run pages:build
npx wrangler pages deploy .vercel/output/static
```

## Quiz type

### 文字·語彙

#### 1.汉子发音(漢字→ひらがな、ひらがな→漢字)

![example](./docs/moji-1.png)

#### 2.相似词意(找出与句子中的划线词汇相近意思的选项)

![example](./docs/moji-2.png)

#### 3.最佳选项（填入符合句意的选项）

![example](./docs/moji-3.png)

### 文法

#### 1.选词填空

![example](./docs/buubo-1.png)

#### 2.选词填空（排序）

![example](./docs/buubo-2.png)

### 汉字（n2）

![N2汉字]https://test.jlpt-easy.pages.dev/kanji

### 汉字（n1）

![N1汉字]https://test.jlpt-easy.pages.dev/kanji-1

### 文法(N5~N1)

![grammar]https://test.jlpt-easy.pages.dev/grammar

## Deploy on Cloudflare

### useful links
[Cloundflare official docs](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-nextjs-site/)

[deploy exist Next.js project on Cloudflare](https://github.com/cloudflare/next-on-pages/tree/main/packages/next-on-pages)

## Script

一些批量处理的工具

### 输出Core N2 汉字列表

```bash
# N2 kanji which frequency is greater than 1000
node scripts/n2-kanji-core-list.js
```

生成文件在: **app/data/n2-kanji-core-list.json**

在``/kanji``页面中可切换 core 列表模式

## Others

### data/kanjiV2 数据来源

https://github.com/jamsinclair/open-anki-jlpt-decks

NOTE：看起来是一个可作为Anki数据源的仓库