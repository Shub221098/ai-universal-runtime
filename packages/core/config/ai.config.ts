import { z } from 'zod';

export const AIConfigSchema = z.object({
    framework: z.enum(['mastra', 'langchain', 'custom']),

    llm: z.object({
        provider: z.enum(['openai', 'ollama', 'anthropic', 'google']),
        model: z.string().min(1),
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().int().positive().optional(),
        apiKey: z.string().optional(),
        baseUrl: z.string().url().optional(),
        timeoutMs: z.number().positive().optional(),
        capabilities: z.object({
            streaming: z.boolean().optional(),
            tools: z.boolean().optional(),
            vision: z.boolean().optional(),
        }).optional(),
    }),

    embeddings: z.object({
        provider: z.enum(['openai', 'cohere', 'huggingface', 'bge']),
        model: z.string().optional(),
        dimensions: z.number().int().positive().optional(),
        apiKey: z.string().optional(),
        timeoutMs: z.number().positive().optional(),
    }),

    vectorStore: z.object({
        provider: z.enum(['qdrant', 'pinecone', 'chroma', 'memory']),
        url: z.string().optional(),
        apiKey: z.string().optional(),
        collectionName: z.string().optional(),
        dimension: z.number().int().positive().optional(),
        distance: z.enum(['cosine', 'dot', 'euclid']).optional(),
    }),
});

export type AIConfig = z.infer<typeof AIConfigSchema>;

const rawConfig: AIConfig = {
    framework: "mastra",

    llm: {
        provider: "ollama",
        model: "llama3.1:latest",
        timeoutMs: 30000,
        capabilities: {
            streaming: true,
            tools: true
        }
    },

    embeddings: {
        provider: "bge",
        timeoutMs: 10000
    },

    vectorStore: {
        provider: "qdrant",
        distance: "cosine"
    }
};

// Validate and export
export const aiConfig = AIConfigSchema.parse(rawConfig);
