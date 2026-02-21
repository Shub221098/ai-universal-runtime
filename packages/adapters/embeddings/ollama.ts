import { EmbeddingProvider } from '../../core/embeddings/EmbeddingProvider';

export class OllamaEmbeddingAdapter extends EmbeddingProvider {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        super();
        this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    }

    async embed(text: string): Promise<number[]> {
        const response = await fetch(`${this.baseUrl}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.1:latest', // or 'mxbai-embed-large' or any other model pulled
                prompt: text,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama Embedding Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.embedding;
    }

    async embedBatch(texts: string[]): Promise<number[][]> {
        // Simple sequential batching for now
        return Promise.all(texts.map(text => this.embed(text)));
    }
}
