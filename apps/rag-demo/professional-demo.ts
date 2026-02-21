import * as dotenv from 'dotenv';
dotenv.config();

import { SemanticChunker } from '../../packages/core/tools/SemanticChunker';
import { VectorStoreFactory } from '../../packages/core/vector/VectorStoreFactory';
import { LLMFactory } from '../../packages/core/llm/LLMFactory';
import { EmbeddingFactory } from '../../packages/core/embeddings/EmbeddingFactory';
import { aiConfig } from '../../packages/core/config/ai.config';

async function professionalWalkthrough() {
    console.clear();
    console.log('\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════');
    console.log('\x1b[33m%s\x1b[0m', '      LOCAL RUNTIME USAGE DEMONSTRATION');
    console.log('\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════');

    // 1. DATA PREPARATION (The Semantic Chunker)
    console.log(`\n\x1b[1m[STEP 1] DATA PREPARATION\x1b[0m`);
    const longDocument = "The AI Universal Runtime is a powerful middleware designed for speed. It allows developers to switch between OpenAI and Ollama without changing application code. This project uses the 'Adapter Pattern' to ensure zero vendor lock-in. It also features 'Safety Guardians' like Retry and Cost monitoring to make AI reliable for production apps.";

    const chunks = SemanticChunker.chunk(longDocument, 100, 20);
    console.log(`✂️  Original text scientifically split into \x1b[32m${chunks.length}\x1b[0m smart chunks.`);

    // 2. VECTORIZATION & STORAGE (Real Embeddings!)
    console.log(`\n\x1b[1m[STEP 2] VECTORIZATION & STORAGE\x1b[0m`);
    const embeddingModel = EmbeddingFactory.create();
    const vectorStore = VectorStoreFactory.create();

    console.log(`📡 Creating real vector embeddings via \x1b[32m${aiConfig.embeddings.provider}\x1b[0m...`);
    const vectors = await embeddingModel.embedBatch(chunks);

    console.log(`📦 Storing in \x1b[32m${aiConfig.vectorStore.provider}\x1b[0m (Qdrant)...`);
    await vectorStore.add(vectors, chunks.map(c => ({ text: c })));
    console.log(`✅ Chunks successfully synchronized with Vector database.`);

    // 3. RETRIEVAL & BRAIN (The LLM Factory)
    console.log(`\n\x1b[1m[STEP 3] SMART SEARCH & GENERATION (RAG)\x1b[0m`);
    const llm = LLMFactory.create();
    const userQuery = "How does this project handle vendor lock-in?";

    console.log(`🔍 Searching database for: "${userQuery}"...`);
    const queryVector = await embeddingModel.embed(userQuery);
    const searchResults = await vectorStore.query(queryVector, 2);

    const context = searchResults.map((r: any) => r.payload.text).join('\n');
    console.log(`📖 Found relevant context in database.`);

    const augmentedPrompt = `
Context from knowledge base:
${context}

User Question: ${userQuery}

Answer the question strictly based on the provided context. If you don't know, say so.
`;

    console.log(`📡 Asking LLM via \x1b[32mAgile Middleware Pipeline\x1b[0m...\n`);

    console.log(`\x1b[1m--- AI RESPONSE ---\x1b[0m`);
    for await (const chunk of llm.stream(augmentedPrompt)) {
        process.stdout.write(`\x1b[37m${chunk}`);
    }
    console.log(`\x1b[0m\n`);

    console.log('\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════');
    console.log('\x1b[32m%s\x1b[0m', '      WALKTHROUGH COMPLETE');
    console.log('\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════\n');
}

professionalWalkthrough().catch(err => {
    console.error(`\n\x1b[31m[!] DEMO FAILED:\x1b[0m ${err.message}`);
    process.exit(1);
});
