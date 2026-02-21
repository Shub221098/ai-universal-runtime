import express from 'express';
import { LLMFactory } from '../../packages/core/llm/LLMFactory';
import { EmbeddingFactory } from '../../packages/core/embeddings/EmbeddingFactory';
import { VectorStoreFactory } from '../../packages/core/vector/VectorStoreFactory';
import { aiConfig } from '../../packages/core/config/ai.config';

const app = express();
app.use(express.json());

/**
 * Endpoint 1: Simple Chat
 * Uses the model's base training knowledge.
 */
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        const llm = LLMFactory.create();
        const response = await llm.generate(message);
        res.json({ reply: response.text, mode: 'base_ai' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 2: Professional RAG
 * Searches your private database before answering.
 */
app.post('/api/rag', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        console.log(`\x1b[94m[API RAG]\x1b[0m Processing RAG request for: "${message}"`);

        // 1. Vectorize the question
        const embeddingModel = EmbeddingFactory.create();
        const vectorStore = VectorStoreFactory.create();
        const queryVector = await embeddingModel.embed(message);

        // 2. Search private database
        const searchResults = await vectorStore.query(queryVector, 2);
        const context = searchResults.map((r: any) => r.payload.text).join('\n');

        // 3. Generate answer with context
        const llm = LLMFactory.create();
        const augmentedPrompt = `Context from our database:\n${context}\n\nQuestion: ${message}\n\nAnswer strictly based on the context above.`;

        const response = await llm.generate(augmentedPrompt);

        res.json({
            reply: response.text,
            mode: 'rag_ai',
            context_used: context.substring(0, 100) + '...'
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n\x1b[32m[SERVER READY]\x1b[0m`);
    console.log(`🚀 Base Chat: http://localhost:${PORT}/api/chat`);
    console.log(`🧠 Smart RAG: http://localhost:${PORT}/api/rag`);
});
