import { LLMFactory } from '../../packages/core/llm/LLMFactory';

async function evaluateRAG() {
    const llm = LLMFactory.create();

    const context = "The project uses the 'Adapter Pattern' to ensure zero vendor lock-in.";
    const query = "How does it handle vendor lock-in?";
    const answer = "It uses the Adapter Pattern to avoid being tied to one provider.";

    console.log(`\n\x1b[35m[RAG EVALUATOR]\x1b[0m Judging response quality...`);

    const evalPrompt = `
You are an AI Quality Judge. Rate the following RAG answer on a scale of 1-5 for "Faithfulness" to the context.

CONTEXT: ${context}
USER QUERY: ${query}
AI ANSWER: ${answer}

Provide your response in this format:
Score: [1-5]
Reasoning: [One sentence explanation]
`;

    const evaluation = await llm.generate(evalPrompt);

    console.log(`\x1b[1m--- EVALUATION RESULTS ---\x1b[0m`);
    console.log(evaluation.text);
}

evaluateRAG().catch(console.error);
