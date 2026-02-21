# 🤖 AI Universal Runtime

> **The "Universal Remote" for Artificial Intelligence.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Imagine you bought a high-end TV, but you could only ever use one specific remote that came with it. If you wanted to change brands, you'd have to rebuild your whole living room. 

**AI Universal Runtime** fixes that for AI apps. It is a "translation layer" that allows developers to write code once and switch between different AI models (like ChatGPT, Anthropic, or local models like Ollama) or databases (like Qdrant or Pinecone) just by flipping a switch in a configuration file.

---

## 🌟 Why This Matters

- 🔓 **Freedom from Choice**: Stop worrying about which AI company will win. Use whichever one is cheapest or fastest today, and swap tomorrow without rewriting your code.
- 💰 **Save Money**: Use lightweight, free local models (Ollama) while developing your app, then switch to powerful models (GPT-4) for production.
- 🏗️ **Professional Blueprint**: Built on industry-standard engineering patterns (Adapter & Factory), ensuring your app is organized and ready for scale.
- 🛡️ **Built-in Safety**: Automatically checks your settings to prevent common AI integration errors before they happen.

---

## 🏗️ How It Works (The Blueprint)

The runtime sits between your actual application and the AI providers, acting as a smart middleman.

![Architecture Diagram](docs/architecture.svg)

---

## ⚙️ The "Switch" (Config-Driven)

The entire behavior of your AI stack is controlled by `packages/core/config/ai.config.ts`. It’s as simple as turning a dial:

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
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 2. Configure
Copy `.env.example` to a new file named `.env` and add your API keys or local server URLs.

### 3. Run the Demos
See the universal runtime in action with these easy commands:

- **AI Chat Demo**: Ask the AI anything and watch it stream the answer back.
  ```bash
  npm run rag:demo "What is the benefit of a provider-agnostic AI?"
  ```

- **Data Dashboard**: See what's currently stored in your AI's "memory" (Vector Store).
  ```bash
  npm run dashboard
  ```

---

## 🗺️ Roadmap: What's Next?
- [x] **Core "Smart Middleman" Logic**
- [x] **Universal Remote (Config System)**
- [x] **OpenAI & Ollama Support**
- [x] **Real-time Streaming**
- [ ] **Mobile App Integration**
- [ ] **Cost Monitoring Dashboard**

---

## 📄 License
Project is licensed under the MIT License. Built for developers who want to stay fast and stay free.