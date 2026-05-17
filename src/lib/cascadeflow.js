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
    if (q.includes('password') || q.includes('private') || q.includes('secret') || q.includes('ssn') || q.includes('key')) {
      return this.selectModel('llama3', 'Privacy detected: Routing to local Ollama instance for security.');
    }

    // Route based on complexity score buckets
    if (complexity >= 14) {
      return this.selectModel('gpt-4o', `Extreme complexity (Score ${complexity}): Routing to GPT-4o for advanced reasoning & strategic math.`);
    }
    
    if (complexity >= 9) {
      // Differentiate between deep analysis/data (Gemini) vs strict regulation/legal (Claude)
      if (q.includes('sebi') || q.includes('regulation') || q.includes('legal') || q.includes('law') || q.includes('compliance')) {
        return this.selectModel('claude-3-5-sonnet-20240620', `High complexity regulatory query (Score ${complexity}): Using Claude 3.5 Sonnet.`);
      } else {
        return this.selectModel('gemini-1.5-pro', `High complexity data analysis (Score ${complexity}): Routing to Gemini 1.5 Pro.`);
      }
    }
    
    if (complexity >= 5) {
      return this.selectModel('gpt-4o-mini', `Medium complexity (Score ${complexity}): Routing to GPT-4o Mini for precise balanced analysis.`);
    }

    // Default / Low complexity
    return this.selectModel('llama-3.1-8b-instant', `Standard query (Score ${complexity}): Using Groq Llama 3.1 8B for instant response.`);
  }

  analyzeComplexity(query) {
    let score = 0;
    const q = query.toLowerCase();
    
    // Low-mid difficulty signals: calculations, data extraction
    if (q.includes('calculate') || q.includes('math') || q.includes('formula') || q.includes('tax') || q.includes('interest')) score += 4;
    if (q.includes('compare') || q.includes('vs') || q.includes('difference')) score += 3;
    
    // High difficulty signals: analysis, long-term impact, regulation
    if (q.includes('impact') || q.includes('analyze') || q.includes('future') || q.includes('forecast')) score += 5;
    if (q.includes('sebi') || q.includes('regulation') || q.includes('legal') || q.includes('law') || q.includes('compliance')) score += 6;
    if (q.includes('long-term') || q.includes('portfolio') || q.includes('strategy') || q.includes('planning')) score += 5;
    
    // Extreme difficulty signals: deep reasoning, risk modeling, custom portfolio structures
    if (q.includes('optimize') || q.includes('risk modeling') || q.includes('scenario') || q.includes('stress test')) score += 8;
    if (q.includes('valuation') || q.includes('dcf') || q.includes('black-scholes') || q.includes('derivative')) score += 8;
    
    // Length as a proxy for detail / context size
    if (q.length > 300) score += 5;
    else if (q.length > 150) score += 3;
    else if (q.length > 50) score += 1;
    
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
