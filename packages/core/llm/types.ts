export type LLMConfig = {
  modelName: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
};

export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
