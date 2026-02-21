import { LLMConfig, LLMResponse } from './types';
import { LLMProvider } from './LLMProvider';

/**
 * Intelligent Cache Middleware
 * Supports both standard generation and streaming responses.
 */
export class CacheMiddleware extends LLMProvider {
    private static cache = new Map<string, LLMResponse>();
    private static streamCache = new Map<string, string[]>();

    constructor(private provider: LLMProvider) {
        super();
    }

    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        const cacheKey = this.getCacheKey(prompt, config);

        if (CacheMiddleware.cache.has(cacheKey)) {
            const cachedResponse = CacheMiddleware.cache.get(cacheKey)!;
            console.log(`\x1b[36m[CACHE HIT]\x1b[0m Returning saved response.`);
            return cachedResponse;
        }

        const response = await this.provider.generate(prompt, config);
        CacheMiddleware.cache.set(cacheKey, response);
        return response;
    }

    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        const cacheKey = this.getCacheKey(prompt, config);

        if (CacheMiddleware.streamCache.has(cacheKey)) {
            const chunks = CacheMiddleware.streamCache.get(cacheKey)!;
            console.log(`\x1b[36m[CACHE HIT]\x1b[0m Streaming from cache...`);
            for (const chunk of chunks) {
                yield chunk;
            }
            return;
        }

        const chunks: string[] = [];
        for await (const chunk of this.provider.stream(prompt, config)) {
            chunks.push(chunk);
            yield chunk;
        }
        CacheMiddleware.streamCache.set(cacheKey, chunks);
    }

    private getCacheKey(prompt: string, config?: Partial<LLMConfig>): string {
        return `${config?.modelName || 'default'}_${prompt}`;
    }
}

export const withCache = () => (p: LLMProvider) => new CacheMiddleware(p);
