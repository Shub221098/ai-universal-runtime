import { LLMProvider } from './packages/core/llm/LLMProvider';
import { LLMConfig, LLMResponse } from './packages/core/llm/types';
import { CacheMiddleware } from './packages/core/llm/CacheMiddleware';

class MockProvider extends LLMProvider {
    public callCount = 0;
    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        this.callCount++;
        return { text: `Response to ${prompt}` };
    }
    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        this.callCount++;
        yield `Stream to ${prompt}`;
    }
}

async function verifyCache() {
    const mock = new MockProvider();
    const cachedProvider = new CacheMiddleware(mock);

    console.log('--- Testing Standard Generation ---');
    console.log('Call 1 (Expect network):');
    await cachedProvider.generate('Hello');
    console.log(`Call Count: ${mock.callCount}`);

    console.log('Call 2 (Expect CACHE HIT):');
    await cachedProvider.generate('Hello');
    console.log(`Call Count: ${mock.callCount} (Should still be 1)`);

    if (mock.callCount === 1) {
        console.log('\n✅ SUCCESS: Generation Cache is working!');
    } else {
        console.log('\n❌ FAILURE: Generation Cache failed!');
    }

    console.log('\n--- Testing Streaming Cache ---');
    console.log('Stream 1 (Expect network):');
    for await (const _ of cachedProvider.stream('Hi')) { }
    console.log(`Call Count: ${mock.callCount}`);

    console.log('Stream 2 (Expect CACHE HIT):');
    for await (const _ of cachedProvider.stream('Hi')) { }
    console.log(`Call Count: ${mock.callCount} (Should still be 2)`);

    if (mock.callCount === 2) {
        console.log('\n✅ SUCCESS: Streaming Cache is working!');
    } else {
        console.log('\n❌ FAILURE: Streaming Cache failed!');
    }
}

verifyCache();
