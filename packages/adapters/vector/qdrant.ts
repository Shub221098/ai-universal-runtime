import { VectorStoreProvider } from '../../core/vector/VectorStoreProvider';

export class QdrantAdapter extends VectorStoreProvider {
    private url: string;
    private apiKey: string;
    private collectionName: string;

    constructor(url?: string, apiKey?: string, collectionName?: string) {
        super();
        this.url = url || process.env.QDRANT_URL || 'http://localhost:6333';
        this.apiKey = apiKey || process.env.QDRANT_API_KEY || '';
        this.collectionName = collectionName || 'ai_runtime_collection';
    }

    private async request(path: string, method: string = 'GET', body?: any) {
        const headers: any = { 'Content-Type': 'application/json' };
        if (this.apiKey) headers['api-key'] = this.apiKey;

        const response = await fetch(`${this.url}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(`Qdrant API Error: ${JSON.stringify(error)}`);
        }

        return response.json();
    }

    async add(vectors: number[][], metadata: any[], collection?: string): Promise<void> {
        const targetCollection = collection || this.collectionName;
        // Ensure collection exists
        await this.request(`/collections/${targetCollection}`, 'PUT', {
            vectors: { size: vectors[0].length, distance: 'Cosine' }
        }).catch(() => { }); // Ignore if exists

        const points = vectors.map((v, i) => ({
            id: i + Math.floor(Math.random() * 1000000), // Quick unique ID for demo
            vector: v,
            payload: metadata[i]
        }));

        await this.request(`/collections/${targetCollection}/points`, 'PUT', {
            points,
            wait: true
        });
    }

    async query(vector: number[], topK: number, collection?: string): Promise<any[]> {
        const targetCollection = collection || this.collectionName;
        const result = await this.request(`/collections/${targetCollection}/points/search`, 'POST', {
            vector,
            limit: topK,
            with_payload: true
        });

        return result.result;
    }
}
