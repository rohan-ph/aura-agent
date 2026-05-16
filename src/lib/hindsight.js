export class Hindsight {
  constructor() {
    this.storageKey = 'hindsight_memory_bank';
    this.memory = JSON.parse(localStorage.getItem(this.storageKey)) || {
      facts: [],
      preferences: {},
      mentalModel: {
        riskProfile: 'Unknown',
        interests: [],
        pastDecisions: []
      }
    };
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
  }

  retain(interaction) {
    // Simulated entity extraction
    const text = interaction.content.toLowerCase();
    
    if (text.includes('crypto') || text.includes('binance')) {
      this.addFact('User has experience with crypto (Binance)');
      if (!this.memory.mentalModel.interests.includes('Cryptocurrency')) {
        this.memory.mentalModel.interests.push('Cryptocurrency');
      }
    }
    
    // Name extraction: "I am Rohan" or "My name is Rohan"
    const nameMatch = interaction.content.match(/(?:i am|my name is)\s+([A-Za-z]+)/i);
    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1];
      this.memory.mentalModel.userName = name;
      this.addFact(`User's name is ${name}`);
    }

    if (text.includes('invest') && (text.includes('start') || text.includes('new'))) {
      this.addFact('User is looking to start a new investment journey');
    }

    // Risk profile detection — order matters (check medium before high/low to avoid substring conflicts)
    if (text.includes('medium risk') || text.includes('moderate risk') || text.includes('risk') && text.includes('medium') || text.includes('risk') && text.includes('moderate')) {
      this.memory.mentalModel.riskProfile = 'Medium';
    } else if (text.includes('high risk') || (text.includes('risk') && text.includes('high'))) {
      this.memory.mentalModel.riskProfile = 'High';
    } else if (text.includes('low risk') || (text.includes('risk') && text.includes('low'))) {
      this.memory.mentalModel.riskProfile = 'Low';
    }

    this.save();
  }

  addFact(content) {
    // Check against .content property (facts are objects, not strings)
    const alreadyExists = this.memory.facts.some(f => f.content === content);
    if (!alreadyExists) {
      this.memory.facts.push({
        content,
        timestamp: new Date().toISOString()
      });
    }
  }

  recall(query) {
    // Simple keyword based recall
    const keywords = query.toLowerCase().split(' ');
    return this.memory.facts.filter(fact => 
      keywords.some(kw => fact.content.toLowerCase().includes(kw))
    );
  }

  reflect() {
    // Periodically synthesize insights
    const factsCount = this.memory.facts.length;
    let insight = '';

    if (factsCount > 5 && this.memory.mentalModel.riskProfile === 'Unknown') {
      this.memory.mentalModel.riskProfile = 'Moderate (Inferred from volume)';
      insight = 'Inferred Moderate risk profile based on interaction depth.';
    }

    if (this.memory.facts.some(f => f.content.includes('crypto')) && this.memory.mentalModel.riskProfile === 'High') {
      insight = 'Risk profile confirmed as High due to crypto background.';
    }

    this.save();
    return insight;
  }

  getMentalModel() {
    return this.memory.mentalModel;
  }
  
  getFacts() {
    return this.memory.facts;
  }
}
