import { LLMProvider } from '../core/llm';

export interface LangChainAgentConfig {
    name: string;
    instructions: string;
    model: LLMProvider;
}

export class LangChainAgent {
    constructor(private config: LangChainAgentConfig) { }

    async *streamChat(message: string) {
        // LangChain Focus: Structured templates and step-by-step chains.
        console.log(`\x1b[94m[LangChain]\x1b[0m 1. Entering PromptTemplate phase...`);
        const template = `You are following this Chain: ${this.config.name}\nInstructions: ${this.config.instructions}\nInput: {input}`;
        const inputValues = { input: message };

        console.log(`\x1b[94m[LangChain]\x1b[0m 2. Binding LLM to Chain sequence...`);
        const formattedPrompt = template.replace('{input}', inputValues.input);

        console.log(`\x1b[94m[LangChain]\x1b[0m 3. Invoking RunnableStream...`);
        yield* this.config.model.stream(formattedPrompt);
    }
}

export const createLangChainAgent = (config: LangChainAgentConfig) => new LangChainAgent(config);
