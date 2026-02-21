import { aiConfig } from '../config/ai.config';
import { LLMProvider } from './LLMProvider';
import { OpenAIAdapter } from '../../adapters/llm/openai';
import { OllamaAdapter } from '../../adapters/llm/ollama';

export class LLMFactory {
    static create(providerName?: string): LLMProvider {
        const provider = providerName || aiConfig.llm.provider;

        switch (provider) {
            case 'openai':
                return new OpenAIAdapter();
            case 'ollama':
                return new OllamaAdapter();
            default:
                throw new Error(`Unsupported LLM provider: ${provider}`);
        }
    }
}
