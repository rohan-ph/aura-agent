import React from 'react';
import { Activity, Cpu, Clock, DollarSign } from 'lucide-react';

const CascadeAudit = ({ auditTrail, currentSpend, facts = [] }) => {
  const latest = auditTrail[auditTrail.length - 1];

  return (
    <div className="cascade-audit">
      <div className="section-header">
        <Activity size={18} />
        <h3>Intelligence Pulse</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <DollarSign size={14} />
          <div className="stat-value">${parseFloat(currentSpend).toFixed(4)}</div>
          <div className="stat-label">Total Session Cost</div>
        </div>
      </div>

      {latest && (
        <div className="latest-decision-box" style={{ borderLeft: `4px solid ${latest.color}` }}>
          <div className="box-label">LATEST ROUTING DECISION</div>
          <div className="box-main">
            <div className="brain-info">
              <Cpu size={20} style={{ color: latest.color }} />
              <div>
                <div className="brain-name">{latest.modelSelected}</div>
                <div className="brain-subtitle">Current Intelligence Brain</div>
              </div>
            </div>
          </div>
          
          <div className="box-rationale">
            <strong>Rationale:</strong> {latest.rationale}
          </div>

          <div className="box-metrics">
            <div className="metric-item">
              <Clock size={14} />
              <span>{latest.latency.toFixed(0)}ms latency</span>
            </div>
            <div className="metric-item">
              <DollarSign size={14} />
              <span>${latest.cost.toFixed(4)} query cost</span>
            </div>
          </div>
        </div>
      )}

      <div className="trail-container">
        <div className="trail-header">INTELLIGENCE LOG</div>
        {facts.length === 0 ? (
          <div className="empty-logs">Analyzing chat for intentions and plans...</div>
        ) : (
          [...facts].reverse().map((fact, i) => (
            <div key={i} className="audit-entry-mini fact-entry">
              <div className="fact-content">
                <span className="fact-dot"></span>
                <span className="fact-text">{fact.text}</span>
                <span className="fact-time">{new Date(fact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CascadeAudit;
