# Exceed JLPT

This project is a set of interactive JLPT (Japanese Language Proficiency Test) quizzes designed to help learners master various aspects of the Japanese language. It covers Kanji, Grammar, Vocabulary, and Pronunciation, providing a comprehensive learning experience.

## Architecture
![architecture](./architecture.svg)

```mermaid
graph TD
    subgraph Client
        A[Client -> Browser]
        B[Next.js App Router]
        C[Home Page<br/> -> app/page.tsx]
    end

    subgraph Core Application
        subgraph Pages
            D[Kanji Page<br/> -> app/kanji/page.tsx]
            E[Moji Page<br/> -> app/moji/page.tsx]
            F[Moji-1 Page<br/> -> app/moji-1/page.tsx]
            G[Moji-3 Page<br/> -> app/moji-3/page.tsx]
            H[Grammar Page<br/> -> app/grammar/page.tsx]
            I[Sorting Page<br/> -> app/sorting/page.tsx]
        end
        
        subgraph Quiz Pages
            J[Kanji Preview<br/> -> app/kanji/preview/page.tsx]
            K[Moji Quiz<br/> -> app/moji/quiz/page.tsx]
            L[Moji-1 Quiz<br/> -> app/moji-1/quiz/page.tsx]
            M[Moji-3 Quiz<br/> -> app/moji-3/quiz/page.tsx]
        end

        D1[Level Select]
        E1[Redux Store]
        F1[React-Query]
        G1[Gemini AI API]
    end

    subgraph Hosting
        H1[Cloudflare Pages]
    end

    subgraph Future
        I1((Data -> Future DB))
    end

    A --> B
    B --> C
    C -- /kanji --> D
    C -- /moji --> E
    C -- /moji-1 --> F
    C -- /moji-3 --> G
    C -- /grammar --> H
    C -- /sorting --> I

    D --> D1
    E --> D1
    F --> D1
    G --> D1
    
    D --> J
    E --> K
    F --> L
    G --> M
    
    D1 --> E1
    E --> E1
    F --> E1
    G --> E1
    J --> E1
    K --> E1
    L --> E1
    M --> E1

    K --> F1
    L --> F1
    M --> F1
    F1 --> G1
    G1 --> F1
    H --> H1
    H1 --> I1

    style A fill:#FFD700,stroke:#000,color:#000
    style B fill:#6495ED,stroke:#000,color:#fff
    style C fill:#b3f0f2,stroke:#000,color:#000
    style D fill:#09f,stroke:#000,color:#fff
    style E fill:#000b76,stroke:#000,color:#fff
    style F fill:#FFAA33,stroke:#000,color:#fff
    style G fill:#008080,stroke:#000,color:#fff
    style H fill:#e0c0c0,stroke:#000,color:#000
    style I fill:#c0f0c0,stroke:#000,color:#000
    style J fill:#09f,stroke:#000,color:#fff
    style K fill:#000b76,stroke:#000,color:#fff
    style L fill:#FFAA33,stroke:#000,color:#fff
    style M fill:#008080,stroke:#000,color:#fff
    style D1 fill:#FFB6C1,stroke:#000,color:#fff
    style E1 fill:#77ff99,stroke:#000,color:#000
    style F1 fill:#6495ED,stroke:#000,color:#fff
    style G1 fill:#FFA500,stroke:#000,color:#fff
    style H1 fill:#008080,stroke:#000,color:#fff
    style I1 fill:#D3D3,stroke:#000


```

## Project Presentation

### What is Exceed JLPT?

Exceed JLPT is a web application built to assist individuals in their journey to learn and master the Japanese language, specifically targeting those preparing for the JLPT exam.  It offers a variety of interactive quizzes, covering crucial areas such as:

*   **Kanji (漢字):** Test and reinforce your knowledge of Japanese characters.
*   **Grammar (文法):** Practice and understand Japanese grammatical structures.
*   **Vocabulary (語彙):** Expand your Japanese vocabulary with engaging exercises.
*   **Pronunciation (文字(発音)):** Focus on reading and correctly pronuncing.
*   **Words(文字(単語))**: Focus on understanding and using words.

### Key Features

*   **Interactive Quizzes:** The core of the application is its diverse set of quizzes, designed to be engaging and effective.
*   **Level Selection:** Users can choose their proficiency level (N5-N1) to tailor the difficulty.
*   **Gemini AI Integration:**  The quizzes are powered by Google's Gemini AI, ensuring dynamic and challenging questions.
*   **Detailed Feedback:** Users receive explanations and translations for each question.
*   **Progress Tracking:** (Future feature) Users will be able to track their progress and identify areas for improvement.
* **Responsive Design**: The application is designed to work on different screen size.

### How It Works

1.  **Choose a Category:** Select from Kanji, Grammar, Vocabulary, or Pronunciation.
2.  **Select a Level:** Choose your JLPT level (N5, N4, N3, N2, or N1).
3.  **Start the Quiz:** Begin the interactive quiz session.
4.  **Answer Questions:** Test your knowledge with multiple-choice questions.
5.  **Get Feedback:** View detailed explanations and translations after answering each question.
6. **Next Questions**: Get next questions and keep learning.

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