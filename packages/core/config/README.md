# AI Configuration Guide (`ai.config.ts`)

This package manages the central configuration for the AI Universal Runtime. It allows you to switch between different LLM providers, embedding models, vector stores, and frameworks with zero code changes.

## 🛠 Configuration Structure

The `aiConfig` object is divided into four main sections:

### 1. Framework
Select the runtime framework to use.
- `framework`: `'mastra' | 'langchain' | 'custom'`

### 2. LLM (Large Language Models)
- `provider`: `'openai' | 'ollama' | 'anthropic' | 'google'`
- `model`: Specific model ID (e.g., `'llama3.1'`, `'gpt-4o'`)
- `timeoutMs`: Production safety timeout (e.g., `30000`)
- `capabilities`: Override for `streaming`, `tools`, and `vision`.

### 3. Embeddings
- `provider`: `'openai' | 'cohere' | 'huggingface' | 'bge'`
- `dimensions`: Output vector size.

### 4. Vector Store
- `provider`: `'qdrant' | 'pinecone' | 'chroma' | 'memory'`
- `distance`: Distance metric (`'cosine' | 'dot' | 'euclid'`).

---

## 📊 Provider Support Table

| Feature | OpenAI | Ollama | Anthropic | Qdrant | BGE |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Streaming** | ✅ | ✅ | ✅ | - | - |
| **Tools/Functions** | ✅ | ✅ | ✅ | - | - |
| **Vision** | ✅ | ⚠️ | ✅ | - | - |
| **Local Hosting** | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Production Ready** | ✅ | ⚠️ | ✅ | ✅ | ✅ |

---

## 🚀 Quick Usage

```typescript
import { aiConfig } from './packages/core/config/ai.config';

console.log(`Current Framework: ${aiConfig.framework}`);
console.log(`Using LLM: ${aiConfig.llm.provider} (${aiConfig.llm.model})`);
```
