import { LLMProvider, LLMConfig, LLMResponse } from '../../core/llm';

export class OpenAIAdapter extends LLMProvider {
    private apiKey: string;
    private baseUrl: string = 'https://api.openai.com/v1/chat/completions';

    constructor(apiKey?: string) {
        super();
        this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    }

    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        if (!this.apiKey) {
            throw new Error('OpenAI API Key is missing. Please set OPENAI_API_KEY in your .env file.');
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: config?.modelName || 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: config?.temperature ?? 0.7,
                max_tokens: config?.maxTokens,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            text: data.choices[0].message.content,
            usage: {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
            }
        };
    }

    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        // Implementation for streaming would go here
        yield "Streaming is coming soon!";
    }
}
