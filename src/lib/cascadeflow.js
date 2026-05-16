import { MODEL_CONFIGS } from './mockData';

export class Cascadeflow {
  constructor(budgetLimit = 1.00) {
    this.budgetLimit = budgetLimit;
    this.currentSpend = 0;
    this.auditTrail = [];
  }

  route(query) {
    const complexity = this.analyzeComplexity(query);
    const q = query.toLowerCase();
    
    // Budget enforcement
    if (this.currentSpend >= this.budgetLimit) {
      return this.selectModel('llama-3.1-8b-instant', 'Budget limit exceeded. Switching to turbo model.');
    }

    // Friendly/Casual queries -> Gemma
    if (q.includes('hello') || q.includes('hi ') || q.includes('how are you') || q.includes('who are you')) {
      return this.selectModel('gemma2-9b-it', 'Casual interaction: Optimizing for friendly tone.');
    }

    // High complexity -> Llama 70B
    if (complexity > 10) {
      return this.selectModel('llama-3.3-70b-versatile', 'Ultra-high complexity: Requires deep financial analysis.');
    } 
    
    // Medium complexity -> Mixtral
    if (complexity > 5) {
      return this.selectModel('mixtral-8x7b-32768', 'Balanced complexity: Using Mixtral for logical reasoning.');
    }

    // Default -> Llama 8B
    return this.selectModel('llama-3.1-8b-instant', 'Standard query: Factual retrieval sufficient.');
  }

  analyzeComplexity(query) {
    let score = 0;
    const q = query.toLowerCase();
    
    // Complexity markers
    if (q.includes('impact') || q.includes('analyze') || q.includes('future')) score += 5;
    if (q.includes('sebi') || q.includes('regulation') || q.includes('long-term')) score += 3;
    if (q.length > 100) score += 2;
    
    return score;
  }

  selectModel(modelId, rationale) {
    const config = MODEL_CONFIGS.find(m => m.id === modelId);
    const decision = {
      timestamp: new Date().toISOString(),
      modelSelected: config.name,
      rationale,
      cost: config.costPerQuery,
      latency: config.avgLatency + Math.random() * 50,
      color: config.color
    };

    this.currentSpend += config.costPerQuery;
    this.auditTrail.unshift(decision); // Newest first
    return { config, decision };
  }

  getAuditTrail() {
    return this.auditTrail;
  }

  getSpend() {
    return this.currentSpend.toFixed(4);
  }
}
