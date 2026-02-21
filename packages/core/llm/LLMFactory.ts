import { aiConfig } from '../config/ai.config';
import { LLMProvider } from './LLMProvider';
import { OpenAIAdapter } from '../../adapters/llm/openai';
import { OllamaAdapter } from '../../adapters/llm/ollama';
import { withObservability } from './ObservabilityMiddleware';
import { withRetry } from './RetryMiddleware';
import { withCostGuardian } from './CostGuardianMiddleware';
import { withCache } from './CacheMiddleware';

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

        // Professional Piped Middleware Pattern
        return adapter
            .use(withRetry(2))
            .use(withCache())
            .use(withObservability(provider))
            .use(withCostGuardian());
    }
}
