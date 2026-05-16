const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mentalModel: {
    userName: String,
    riskProfile: { type: String, default: 'Unknown' },
    interests: [String],
    pastDecisions: [String]
  },
  facts: [{
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  auditTrail: [{
    modelSelected: String,
    rationale: String,
    cost: Number,
    latency: Number,
    timestamp: { type: Date, default: Date.now },
    color: String
  }],
  totalSpend: { type: Number, default: 0 },
  conversations: [{
    id: { type: String, required: true },
    title: String,
    messages: [{
      role: String,
      content: String,
      timestamp: { type: Date, default: Date.now }
    }],
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', UserSchema);
