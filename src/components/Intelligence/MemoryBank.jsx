import React from 'react';
import { Brain, Database, ShieldCheck, Zap } from 'lucide-react';

const MemoryBank = ({ mentalModel, facts }) => {
  return (
    <div className="memory-bank">
      <div className="section-header">
        <Brain size={18} />
        <h3>Hindsight Memory Bank</h3>
      </div>

      <div className="mental-model-card">
        <div className="model-row">
          <ShieldCheck size={16} />
          <div className="model-info">
            <div className="label">Risk Profile</div>
            <div className="value">
              {mentalModel.riskProfile === 'Unknown' ? (
                <span className="onboarding-text">Chat to define strategy</span>
              ) : mentalModel.riskProfile}
            </div>
          </div>
        </div>
        <div className="model-row">
          <Zap size={16} />
          <div className="model-info">
            <div className="label">Focus Areas</div>
            <div className="value">
              {mentalModel.interests.length > 0 
                ? mentalModel.interests.join(', ') 
                : <span className="onboarding-text">Analyzing your interests...</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="facts-container">
        <div className="sub-header">
          <Database size={14} />
          <span>Intelligence Log</span>
        </div>
        {facts.length === 0 ? (
          <div className="onboarding-tips">
            <p>Aura is learning from you. Try saying:</p>
            <ul>
              <li>"I'm a conservative investor"</li>
              <li>"I'm interested in AI stocks"</li>
              <li>"Remind me to check Nifty at 10am"</li>
            </ul>
          </div>
        ) : (
          facts.map((fact, i) => (
            <div key={i} className="fact-item animate-fade-in">
              <div className="fact-dot" />
              <div className="fact-content">{fact.content}</div>
              <div className="fact-time">{new Date(fact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoryBank;
