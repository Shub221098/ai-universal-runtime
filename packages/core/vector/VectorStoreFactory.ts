import { aiConfig } from '../config/ai.config';
import { VectorStoreProvider } from './VectorStoreProvider';
import { QdrantAdapter } from '../../adapters/vector/qdrant';

export class VectorStoreFactory {
    static create(providerName?: string): VectorStoreProvider {
        const provider = providerName || aiConfig.vectorStore.provider;

        switch (provider) {
            case 'qdrant':
                return new QdrantAdapter();
            default:
                throw new Error(`Unsupported Vector Store provider: ${provider}`);
        }
    }
}
