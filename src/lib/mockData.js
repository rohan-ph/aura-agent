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
    name: 'Groq/Llama-3.1-8b',
    type: 'fast',
    costPerQuery: 0.00005,
    avgLatency: 50,
    capability: 'Fast factual retrieval',
    color: '#238636'
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq/Llama-3.3-70b',
    type: 'power',
    costPerQuery: 0.0006,
    avgLatency: 200,
    capability: 'Deep reasoning & analysis',
    color: '#1f6feb'
  }
];
