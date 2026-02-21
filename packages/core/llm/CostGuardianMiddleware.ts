import { LLMConfig, LLMResponse } from './types';
import { LLMProvider } from './LLMProvider';

export class CostGuardianMiddleware extends LLMProvider {
    // Current market rates per 1M tokens (Example: GPT-4o)
    private prices: Record<string, { prompt: number, completion: number }> = {
        'gpt-4o': { prompt: 5.00, completion: 15.00 },
        'gpt-4-turbo': { prompt: 10.00, completion: 30.00 },
        'gpt-3.5-turbo': { prompt: 0.50, completion: 1.50 },
    };

    constructor(private provider: LLMProvider) {
        super();
    }

    async generate(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
        const response = await this.provider.generate(prompt, config);
        this.logCost(config?.modelName, response.usage);
        return response;
    }

    async *stream(prompt: string, config?: Partial<LLMConfig>): AsyncIterable<string> {
        yield* this.provider.stream(prompt, config);
    }

    private logCost(model?: string, usage?: LLMResponse['usage']) {
        if (!model || !usage || !this.prices[model]) return;

        const price = this.prices[model];
        const cost = (usage.promptTokens / 1000000 * price.prompt) +
            (usage.completionTokens / 1000000 * price.completion);

        console.log(`\x1b[32m[COST GUARDIAN]\x1b[0m Model: ${model} | Est. Cost: $${cost.toFixed(6)}`);
    }
}

export const withCostGuardian = () => (p: LLMProvider) => new CostGuardianMiddleware(p);
