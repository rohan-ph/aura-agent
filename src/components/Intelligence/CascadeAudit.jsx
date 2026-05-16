import React from 'react';
import { Activity, Cpu, Clock, DollarSign } from 'lucide-react';

const CascadeAudit = ({ auditTrail, currentSpend }) => {
  return (
    <div className="cascade-audit">
      <div className="section-header">
        <Activity size={18} />
        <h3>Cascadeflow Audit</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <DollarSign size={14} />
          <div className="stat-value">${currentSpend}</div>
          <div className="stat-label">Total Spend</div>
        </div>
      </div>

      <div className="trail-container">
        {auditTrail.length === 0 ? (
          <div className="empty-state">No routing decisions yet.</div>
        ) : (
          auditTrail.map((entry, i) => (
            <div key={i} className="audit-entry" style={{ borderColor: entry.color }}>
              <div className="entry-header">
                <span className="model-badge" style={{ backgroundColor: entry.color }}>
                  {entry.modelSelected}
                </span>
                <span className="timestamp">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="rationale">{entry.rationale}</p>
              <div className="entry-footer">
                <div className="metric">
                  <Clock size={12} />
                  <span>{entry.latency.toFixed(0)}ms</span>
                </div>
                <div className="metric">
                  <DollarSign size={12} />
                  <span>${entry.cost.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CascadeAudit;
