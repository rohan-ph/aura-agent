import { MODEL_CONFIGS } from './mockData';

export class Cascadeflow {
  constructor(budgetLimit = 1.00) {
    this.budgetLimit = budgetLimit;
    this.currentSpend = 0;
    this.auditTrail = [];
  }

  route(query) {
    const complexity = this.analyzeComplexity(query);
    
    // Budget enforcement
    if (this.currentSpend >= this.budgetLimit) {
      return this.selectModel('llama-3.1-8b-instant', 'Budget limit exceeded. Switching to cheapest model.');
    }

    if (complexity > 7) {
      return this.selectModel('llama-3.3-70b-versatile', 'High complexity detected: Requires multi-step reasoning.');
    } else {
      return this.selectModel('llama-3.1-8b-instant', 'Low complexity: Factual retrieval/summary sufficient.');
    }
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
