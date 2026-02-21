import { LLMProvider } from '../core/llm';

export interface MastraAgentConfig {
    name: string;
    instructions: string;
    model: LLMProvider;
}

export class MastraAgent {
    private name: string;
    private instructions: string;
    private model: LLMProvider;

    constructor(config: MastraAgentConfig) {
        this.name = config.name;
        this.instructions = config.instructions;
        this.model = config.model;
    }

    async chat(message: string) {
        const fullPrompt = `System: ${this.instructions}\nUser: ${message}`;
        return this.model.generate(fullPrompt);
    }

    async *streamChat(message: string) {
        const fullPrompt = `System: ${this.instructions}\nUser: ${message}`;
        yield* this.model.stream(fullPrompt);
    }
}

export const createAgent = (config: MastraAgentConfig) => {
    return new MastraAgent(config);
};
