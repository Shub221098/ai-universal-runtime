import { LLMConfig, LLMResponse } from './types';
import { LLMProvider } from './LLMProvider';

export class RetryMiddleware extends LLMProvider {
    constructor(
        private provider: LLMProvider,
        private maxRetries: number = 3,
        private initialDelayMs: number = 1000
    ) {
        super();
    }

    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        let lastError: any;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                return await this.provider.generate(prompt, config);
            } catch (error: any) {
                lastError = error;
                const status = (error as any).status;
                if (status === 429 || status >= 500 || error.message.includes('fetch failed')) {
                    if (attempt === this.maxRetries) break;
                    const delay = this.initialDelayMs * Math.pow(2, attempt);
                    console.log(`\x1b[33m[RETRY]\x1b[0m Attempt ${attempt + 1}/${this.maxRetries} failed. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    }

    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        yield* this.provider.stream(prompt, config);
    }
}

export const withRetry = (max: number = 3) => (p: LLMProvider) => new RetryMiddleware(p, max);
