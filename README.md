# Free Focus Games: Scientific Brain Training Platform

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL_3.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.freefocusgames.com)](https://www.freefocusgames.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

> **Open Source Cognitive Training Implementation**
>
> A modern, scientific brain training platform built with Next.js 15, TypeScript, and Tailwind CSS. Featuring implementations of validated cognitive tasks like Dual N-Back, Stroop Test, and Schulte Tables.

## 👉 [Play the Game Online (Best Experience)](https://www.freefocusgames.com) 👈

Experience the full-featured, optimized version of these games on our official website.

---

## 🧠 Why This Project?

This repository contains the source code for [FreeFocusGames.com](https://www.freefocusgames.com), a collection of cognitive exercises designed to improve:
*   **Working Memory**
*   **Attention Span**
*   **Processing Speed**
*   **Cognitive Flexibility**

Unlike many proprietary brain training apps, this project provides transparent, scientific implementations of classic cognitive psychology paradigms.

## 🎮 Included Games & Algorithms

This repository features production-ready implementations of the following cognitive tasks:

### 1. [Dual N-Back](/app/[locale]/(main)/games/dual-n-back)
The gold standard for working memory training. Based on the research by Susanne Jaeggi, this task requires users to simultaneously track visual and auditory stimuli sequences.
*   **Keywords**: *Fluid Intelligence, Working Memory, Jaime Jaeggi, N-Back Algorithm*

### 2. [Schulte Table](/app/[locale]/(main)/games/schulte-table)
A grid of randomly distributed numbers used for speed reading development and peripheral vision training.
*   **Keywords**: *Speed Reading, Attention Control, Peripheral Vision, Focus Grid*

### 3. [Stroop Effect Test](/app/[locale]/(main)/games/stroop-effect-test)
A neuropsychological test demonstrating the reaction time delay between congruent and incongruent stimuli. Measures cognitive flexibility and executive function.
*   **Keywords**: *Selective Attention, Cognitive Flexibility, Executive Function, Inhibition Control*

### 4. [Mahjong Dual N-Back](/app/[locale]/(main)/games/mahjong-dual-n-back)
A unique variation of the classic N-Back task using Mahjong tiles, designed to be more visually engaging while maintaining cognitive load.

### 5. Other Cognitive Tasks
*   **Reaction Time Test**: Millisecond-precision reaction speed measurement.
*   **Pomodoro Timer**: Focus timer based on the Pomodoro Technique.
*   **Space Memory**: Memorize and recall locations of sequential items.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn/ui](https://ui.shadcn.com/)
*   **Animations**: Framer Motion & Canvas Confetti
*   **Internationalization**: next-intl

## 🚀 Getting Started

To run this project locally for development or educational purposes:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dual-n-back-training-code.git

# 2. Install dependencies
npm install
# or
yarn install

# 3. Set up environment variables
cp .env.local.example .env.local
# (You can leave the variables empty for basic functionality)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the **AGPL-3.0 License** - see the [LICENSE](LICENSE) file for details.
*   ✅ Free to use for personal/educational purposes.
*   ✅ Free to fork and modify (changes must be open-sourced).
*   ❌ Cannot be used in closed-source proprietary software.

---
*Built with ❤️ for the cognitive science community.*
