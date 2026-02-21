import { LLMConfig, LLMResponse } from './types';

export abstract class LLMProvider {
    abstract generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse>;
    abstract stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string>;
}
