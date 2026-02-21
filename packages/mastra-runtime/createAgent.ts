import { LLMProvider } from '../core/llm';

export interface MastraAgentConfig {
    name: string;
    instructions: string;
    model: LLMProvider;
}

export class MastraAgent {
    constructor(private config: MastraAgentConfig) { }

    async *streamChat(message: string) {
        // Mastra Focus: High speed, low overhead.
        // It converts the request into a "Telemetry-aware" execution block.
        console.log(`\x1b[35m[Mastra Engine]\x1b[0m Direct-streaming agent "${this.config.name}"...`);

        const systemPrompt = `[MODE: HIGH_PERFORMANCE]\nSystem: ${this.config.instructions}`;
        const finalPrompt = `${systemPrompt}\nUser: ${message}`;

        yield* this.config.model.stream(finalPrompt);
    }
}

export const createAgent = (config: MastraAgentConfig) => new MastraAgent(config);
