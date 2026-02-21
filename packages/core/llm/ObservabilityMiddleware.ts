import { LLMConfig, LLMResponse } from './types';
import { LLMProvider } from './LLMProvider';

export interface ObservabilityMetrics {
    durationMs: number;
    provider: string;
    model: string;
    usage?: LLMResponse['usage'];
    timestamp: string;
}

export class ObservabilityMiddleware extends LLMProvider {
    constructor(
        private wrappedProvider: LLMProvider,
        private providerName: string
    ) {
        super();
    }

    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        const start = Date.now();
        try {
            const response = await this.wrappedProvider.generate(prompt, config);
            const end = Date.now();
            console.log(`\x1b[90m[METRICS]\x1b[0m ${this.providerName} call took ${end - start}ms`);
            return response;
        } catch (error) {
            const end = Date.now();
            console.error(`\x1b[31m[METRICS ERROR]\x1b[0m Call to ${this.providerName} failed after ${end - start}ms`);
            throw error;
        }
    }

    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        const start = Date.now();
        let firstTokenTime: number | null = null;
        try {
            for await (const chunk of this.wrappedProvider.stream(prompt, config)) {
                if (firstTokenTime === null) {
                    firstTokenTime = Date.now();
                    console.log(`\x1b[90m[METRICS]\x1b[0m Time to first token: ${firstTokenTime - start}ms`);
                }
                yield chunk;
            }
            const end = Date.now();
            console.log(`\x1b[90m[METRICS]\x1b[0m Total stream duration: ${end - start}ms`);
        } catch (error) {
            console.error(`\x1b[31m[METRICS ERROR]\x1b[0m Streaming failed`);
            throw error;
        }
    }
}

export const withObservability = (name: string) => (p: LLMProvider) => new ObservabilityMiddleware(p, name);
