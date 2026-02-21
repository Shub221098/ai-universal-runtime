# 🤖 AI Universal Runtime

> **The "Universal Remote" for Artificial Intelligence—now with built-in Safety Guardians.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Imagine you bought a high-end TV, but you could only ever use one specific remote that came with it. If you wanted to change brands, you'd have to rebuild your whole living room. 

**AI Universal Runtime** fixes that. It is a "translation layer" that allows you to write your code once and switch between different AI models (like ChatGPT, Anthropic, or local models like Ollama) or databases (like Qdrant) just by flipping a switch.

---

## 🏗️ The "Guardians" Architecture (New!)

To make our AI runtime production-ready, we've added a **"Smart Pipeline."** Every request you send to an AI doesn't just go straight to the provider; it passes through three **Guardians** that protect your application:

![Architecture Diagram](docs/architecture.svg)

1.  🛡️ **The Retry Guardian**: AI APIs can be "glitchy" (busy, slow, or temporary errors). This guardian automatically catches those glitches and retries the request instantly so your users never see an error message.
2.  📊 **The Metrics Guardian**: Ever wonder why an AI is feeling slow? This guardian tracks exactly how many milliseconds every part of the process takes, giving you a "speedometer" for your AI.
3.  💰 **The Cost Guardian**: AI isn't free. This guardian estimates the cost of every single question you ask **before** you get the bill, helping you stay within budget.

---

## 🌟 Why This Matters

- 🔓 **No More Lock-in**: Swap your AI brain (Model) or your AI memory (Database) in seconds without changing a single line of application code.
- 💰 **Save Money**: Use lightweight, free local models while building, then switch to powerful models (GPT-4) for launch.
- 🧠 **Smarter Memory**: Includes a **Semantic Chunker** that "reads" your data like a human, ensuring the AI only remembers the most relevant parts when answering questions.
- 🛡️ **Senior-Level Quality**: Built using the same patterns used by top-tier engineering firms (Piped Middleware & Factory Patterns).

---

## ⚙️ The "Switch" (Config-Driven)

The entire behavior of your AI stack is controlled by `packages/core/config/ai.config.ts`. 

```typescript
// To switch your entire app from Local to OpenAI:
export const aiConfig = {
  llm: { 
    provider: "openai", // Just change this
    model: "gpt-4o" 
  },
  // Everything else updates automatically!
};
```

---

## 🚀 Quick Start (Try It Live)

### 1. Setup
```bash
npm install
docker-compose up -d  # Spins up your local AI Database & Server automatically!
```

### 2. Run the Demos
- **AI Chat Demo (with Real-time Metrics!)**:
  ```bash
  npm run rag:demo "What are the benefits of this universal runtime?"
  ```

- **Data Dashboard**: See what's currently stored in your AI's "memory."
  ```bash
  npm run dashboard
  ```

---

## 📄 License
Project is licensed under the MIT License. Built for developers who want to stay fast and stay free.