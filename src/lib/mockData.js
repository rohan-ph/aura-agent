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
    name: 'Llama 3.1 8B (Turbo)',
    type: 'fast',
    costPerQuery: 0.00005,
    avgLatency: 40,
    capability: 'Fast factual retrieval',
    color: '#238636'
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (Balanced)',
    type: 'balanced',
    costPerQuery: 0.0002,
    avgLatency: 120,
    capability: 'Creative & Logical reasoning',
    color: '#d29922'
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B (Ultra)',
    type: 'power',
    costPerQuery: 0.0006,
    avgLatency: 250,
    capability: 'Deep reasoning & complex analysis',
    color: '#1f6feb'
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B (Smart)',
    type: 'creative',
    costPerQuery: 0.0001,
    avgLatency: 80,
    capability: 'Nuanced & Friendly responses',
    color: '#8b5cf6'
  }
];
