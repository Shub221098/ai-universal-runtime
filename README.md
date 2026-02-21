# 🤖 AI Universal Runtime

> **The "Universal Remote" for Artificial Intelligence—now with built-in Safety Guardians.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Imagine you bought a high-end TV, but you could only ever use one specific remote that came with it. If you wanted to change brands, you'd have to rebuild your whole living room. 

**AI Universal Runtime** fixes that. It is a "translation layer" that allows you to write your code once and switch between different AI models (like ChatGPT, Anthropic, or local models like Ollama) or databases (like Qdrant) just by flipping a switch.

---

### 1. 🏗️ The "Guardians" Architecture (New!)

To make our AI runtime production-ready, we've added a **"Smart Pipeline."** Every request you send to an AI doesn't just go straight to the provider; it passes through three **Guardians** that protect your application:

![Architecture Diagram](./docs/architecture.svg)

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

## 📂 Deep Dive: Project Architecture

The project is structured as a **Monorepo** to keep the core logic strictly separated from the specific "connectors" (Adapters) and the final apps.

### 1. `packages/core` (The Brain)
This is the heart of the runtime. It defines the "Contracts" (Interfaces) that every AI service must follow.
- **Factories**: These are the "Dispatchers." When you ask for an LLM, the `LLMFactory` looks at your config and grabs the right adapter.
- **Middleware Pipeline**: This is where the **Guardians** live. We use a "Pipe" pattern, meaning every request is automatically wrapped in safety layers (Retries -> Metrics -> Cost).
- **Config**: A single, type-safe Zod schema that validates your entire AI stack at startup.

### 2. `packages/adapters` (The Connectors)
These are the "Plugs" for different services.
- **LLM Adapters**: Specific code to talk to OpenAI, Ollama, Anthropic, etc.
- **Vector Adapters**: Specific code to talk to Qdrant, Pinecone, or local memory.
- **Embedding Adapters**: Code to translate human text into "AI vectors" using various models.

### 3. `apps/` (The Frontline)
Practical demonstrations of the runtime in action.
- **`rag-demo`**: A full "Talk to your data" implementation showing how search, memory, and chat work together.
- **`dashboard`**: A CLI tool to visualize what's happening inside your AI database.

---

## 🔄 The Data Flow (RAG Journey)

1. **Ingest**: Text is cleaned by the **Semantic Chunker** -> Converted to Vectors by the **Embedding Adapter** -> Stored in **Qdrant**.
2. **Query**: User asks a question -> Question is vectorized -> **Vector Adapter** finds matching data -> **LLM Adapter** generates an answer using that data.
3. **Protect**: Every single step is logged by **Metrics** and protected by **Retries**.

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