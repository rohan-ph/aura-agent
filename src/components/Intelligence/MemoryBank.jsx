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
            <div className="value">{mentalModel.riskProfile}</div>
          </div>
        </div>
        <div className="model-row">
          <Zap size={16} />
          <div className="model-info">
            <div className="label">Interests</div>
            <div className="value">
              {mentalModel.interests.length > 0 
                ? mentalModel.interests.join(', ') 
                : 'Learning...'}
            </div>
          </div>
        </div>
      </div>

      <div className="facts-container">
        <div className="sub-header">
          <Database size={14} />
          <span>Retained Facts</span>
        </div>
        {facts.length === 0 ? (
          <div className="empty-state">No facts retained yet.</div>
        ) : (
          facts.map((fact, i) => (
            <div key={i} className="fact-item animate-fade-in">
              <div className="fact-dot" />
              <div className="fact-content">{fact.content}</div>
              <div className="fact-time">{new Date(fact.timestamp).toLocaleTimeString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoryBank;
