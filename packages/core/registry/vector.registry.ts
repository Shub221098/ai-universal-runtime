import { VectorStoreProvider } from '../vector/VectorStoreProvider';

class VectorRegistry {
    private providers: Map<string, VectorStoreProvider> = new Map();

    register(name: string, provider: VectorStoreProvider) {
        this.providers.set(name, provider);
    }

    get(name: string): VectorStoreProvider | undefined {
        return this.providers.get(name);
    }
}

export const vectorRegistry = new VectorRegistry();
