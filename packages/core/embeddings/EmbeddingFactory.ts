import { aiConfig } from '../config/ai.config';
import { EmbeddingProvider } from './EmbeddingProvider';
import { OllamaEmbeddingAdapter } from '../../adapters/embeddings/ollama';

export class EmbeddingFactory {
    static create(providerName?: string): EmbeddingProvider {
        const provider = providerName || aiConfig.embeddings.provider;

        switch (provider) {
            case 'bge': // Defaulting bge to use ollama locally for demo consistency
            case 'ollama':
                return new OllamaEmbeddingAdapter();
            default:
                throw new Error(`Unsupported Embedding provider: ${provider}`);
        }
    }
}
