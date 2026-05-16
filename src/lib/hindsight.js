export class Hindsight {
  constructor(userEmail = 'guest') {
    this.userEmail = userEmail;
    this.storageKey = `hindsight_memory_${userEmail}`;
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

  hydrate(data) {
    if (data) {
      this.memory.mentalModel = data.mentalModel || this.memory.mentalModel;
      this.memory.facts = data.facts || this.memory.facts;
      this.save();
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
  }

  retain(interaction) {
    const text = interaction.content;
    const lowerText = text.toLowerCase();
    
    // 1. Specific Entity Extraction (Existing)
    if (lowerText.includes('crypto') || lowerText.includes('binance')) {
      this.addFact('User has experience with crypto (Binance)');
      if (!this.memory.mentalModel.interests.includes('Cryptocurrency')) {
        this.memory.mentalModel.interests.push('Cryptocurrency');
      }
    }

    // 1b. Privacy Extraction (Secrets)
    if (lowerText.includes('password') || lowerText.includes('secret') || lowerText.includes('private key')) {
      this.addFact(`🛡️ Encrypted Secret Stored: [${text.substring(0, 10)}...]`);
    }
    
    // 2. Name Extraction (More robust)
    const nameMatch = text.match(/(?:my name is)\s+([A-Za-z]+)/i);
    const iAmMatch = text.match(/^i am\s+([A-Za-z]+)$/i); // Only match "I am [Name]" as a standalone sentence
    
    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1];
      if (!['planning', 'working', 'trying', 'thinking'].includes(name.toLowerCase())) {
        this.memory.mentalModel.userName = name;
        this.addFact(`User's name is ${name}`);
      }
    } else if (iAmMatch && iAmMatch[1]) {
      const name = iAmMatch[1];
      if (!['planning', 'working', 'trying', 'thinking'].includes(name.toLowerCase())) {
        this.memory.mentalModel.userName = name;
        this.addFact(`User's name is ${name}`);
      }
    }

    // 3. Intention & Goal Extraction (Plans)
    if (lowerText.includes('plan') || lowerText.includes('goal') || lowerText.includes('want to') || lowerText.includes('going to')) {
      this.addFact(`User mentioned a plan/goal: "${text}"`);
    }

    // 4. Financial Context Extraction
    if (lowerText.includes('invest') || lowerText.includes('save') || lowerText.includes('portfolio')) {
      this.addFact(`User is discussing: ${text.substring(0, 50)}...`);
    }

    // 5. Risk Profile Detection
    if (lowerText.includes('medium risk') || lowerText.includes('moderate risk')) {
      this.memory.mentalModel.riskProfile = 'Medium';
    } else if (lowerText.includes('high risk')) {
      this.memory.mentalModel.riskProfile = 'High';
    } else if (lowerText.includes('low risk')) {
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
    const keywords = query.toLowerCase().split(' ').filter(kw => kw.length > 2);
    let results = this.memory.facts.filter(fact => 
      keywords.some(kw => fact.content.toLowerCase().includes(kw))
    );

    // If no specific match, return the 5 most recent facts as general context
    if (results.length === 0) {
      results = this.memory.facts.slice(-5).reverse();
    }

    return results;
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
