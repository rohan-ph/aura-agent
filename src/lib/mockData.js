export const INITIAL_MARKET_DATA = {
  indices: [
    { name: 'Nifty 50', value: '23,643.50', change: '+1.15%', trend: 'up' },
    { name: 'Sensex', value: '75,238.00', change: '+0.92%', trend: 'up' },
    { name: 'Nasdaq', value: '26,225.14', change: '+2.45%', trend: 'up' },
  ],
  trending: [
    { symbol: 'IDBI', price: '89.45', change: '+2.3%', reason: 'Strong quarterly earnings' },
    { symbol: 'RELIANCE', price: '2,945.00', change: '+0.8%', reason: 'Expansion in green energy' },
    { symbol: 'SOL/USD', price: '145.20', change: '-4.2%', reason: 'Market consolidation' },
  ]
};

export const MODEL_CONFIGS = [
  {
    id: 'llama-3.1-8b-instant',
    name: 'Groq: Llama 3.1 8B',
    provider: 'groq',
    type: 'fast',
    costPerQuery: 0.00005,
    avgLatency: 40,
    capability: 'Real-time retrieval',
    color: '#238636'
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI: GPT-4o Mini',
    provider: 'openai',
    type: 'balanced',
    costPerQuery: 0.00015,
    avgLatency: 150,
    capability: 'Precise financial math',
    color: '#10a37f'
  },
  {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Anthropic: Claude 3.5 Sonnet',
    provider: 'anthropic',
    type: 'power',
    costPerQuery: 0.003,
    avgLatency: 400,
    capability: 'Deep regulatory analysis',
    color: '#d97757'
  },
  {
    id: 'llama3',
    name: 'Ollama: Llama 3 (Local)',
    provider: 'ollama',
    type: 'private',
    costPerQuery: 0.0000,
    avgLatency: 100,
    capability: 'Privacy-first analysis',
    color: '#ffffff'
  }
];
