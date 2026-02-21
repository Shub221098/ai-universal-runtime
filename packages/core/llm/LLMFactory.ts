import { aiConfig } from '../config/ai.config';
import { LLMProvider } from './LLMProvider';
import { OpenAIAdapter } from '../../adapters/llm/openai';
import { OllamaAdapter } from '../../adapters/llm/ollama';
import { ObservabilityMiddleware } from './ObservabilityMiddleware';

export class LLMFactory {
    static create(providerName?: string): LLMProvider {
        const provider = providerName || aiConfig.llm.provider;
        let adapter: LLMProvider;

        switch (provider) {
            case 'openai':
                adapter = new OpenAIAdapter();
                break;
            case 'ollama':
                adapter = new OllamaAdapter();
                break;
            default:
                throw new Error(`Unsupported LLM provider: ${provider}`);
        }

        // Automatically wrap with observability for analytics
        return new ObservabilityMiddleware(adapter, provider);
    }
}
