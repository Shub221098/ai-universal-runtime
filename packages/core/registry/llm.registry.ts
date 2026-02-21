import { LLMProvider } from '../llm';

class LLMRegistry {
    private providers: Map<string, LLMProvider> = new Map();

    register(name: string, provider: LLMProvider) {
        this.providers.set(name, provider);
    }

    get(name: string): LLMProvider | undefined {
        return this.providers.get(name);
    }
}

export const llmRegistry = new LLMRegistry();
