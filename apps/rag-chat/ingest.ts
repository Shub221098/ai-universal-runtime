import * as dotenv from 'dotenv';
dotenv.config();

import { LLMFactory } from '../../packages/core/llm/LLMFactory';
import { VectorStoreFactory } from '../../packages/core/vector/VectorStoreFactory';
import { aiConfig } from '../../packages/core/config/ai.config';

async function ingest() {
    console.log(`🚀 Starting Ingestion Flow [Framework: ${aiConfig.framework}]`);

    const llm = LLMFactory.create();
    const vectorStore = VectorStoreFactory.create();

    console.log(`📡 Using LLM: ${aiConfig.llm.provider} (${aiConfig.llm.model})`);
    console.log(`📦 Using Vector Store: ${aiConfig.vectorStore.provider}`);

    // Simulate embedding and storage
    const sampleText = "The universal runtime provides a provider-agnostic layer for AI applications.";
    console.log(`📝 Processed: "${sampleText}"`);

    await vectorStore.add([[0.1, 0.2, 0.3]], [{ text: sampleText }]);

    console.log('✅ Ingestion complete.');
}

ingest().catch(console.error);
