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

    // Privacy/Sensitive queries -> Ollama (Local)
    if (q.includes('password') || q.includes('private') || q.includes('secret') || q.includes('ssn')) {
      return this.selectModel('llama3', 'Privacy detected: Routing to local Ollama instance for security.');
    }

    // High complexity / Regulation -> Anthropic (Claude)
    if (complexity > 12 || q.includes('sebi') || q.includes('regulation') || q.includes('legal')) {
      return this.selectModel('claude-3-5-sonnet-20240620', 'High complexity: Using Claude 3.5 Sonnet for deep analysis.');
    } 
    
    // Financial Math / Precise Calculation -> OpenAI (GPT-4o)
    if (q.includes('calculate') || q.includes('math') || q.includes('formula') || q.includes('tax')) {
      return this.selectModel('gpt-4o-mini', 'Calculation detected: Routing to OpenAI for mathematical precision.');
    }

    // Default / Fast -> Groq (Llama 8B)
    return this.selectModel('llama-3.1-8b-instant', 'Standard query: Using Groq for real-time response.');
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
