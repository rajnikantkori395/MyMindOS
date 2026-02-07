/**
 * AI Provider enumeration
 */

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  OLLAMA = 'ollama',
}

export const AIProviderDisplay: Record<AIProvider, string> = {
  [AIProvider.OPENAI]: 'OpenAI',
  [AIProvider.ANTHROPIC]: 'Anthropic',
  [AIProvider.OLLAMA]: 'Ollama',
};
