import { LLMProvider, LLMConfig, LLMResponse } from '../../core/llm';

export class OllamaAdapter extends LLMProvider {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        super();
        this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    }

    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: config?.modelName || 'llama3.1',
                    prompt: prompt,
                    stream: false,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Ollama API Error (${response.status}): ${errorData.error || response.statusText}`);
            }

            const data = await response.json();

            return {
                text: data.response,
            };
        } catch (error: any) {
            if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
                throw new Error(`Ollama connection failed at ${this.baseUrl}. Is Ollama running? Run 'ollama serve' to start it.`);
            }
            throw error;
        }
    }

    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: config?.modelName || 'llama3.1',
                    prompt: prompt,
                    stream: true,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Ollama API Error (${response.status}): ${errorData.error || response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Failed to get body reader from Ollama response');

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            yield data.response;
                        }
                    } catch (e) {
                        // Skip malformed lines
                    }
                }
            }
        } catch (error: any) {
            if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
                throw new Error(`Ollama connection failed at ${this.baseUrl}. Is Ollama running? Run 'ollama serve' to start it.`);
            }
            throw error;
        }
    }
}
