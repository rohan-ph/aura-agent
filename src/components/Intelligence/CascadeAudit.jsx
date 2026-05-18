import React, { useState } from 'react';
import { Activity, Cpu, Clock, DollarSign, Brain, TrendingDown, Zap, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const MODEL_COLORS = {
  'Groq: Llama 3.1 8B':            '#238636',
  'OpenAI: GPT-4o Mini':           '#10a37f',
  'OpenAI: GPT-4o':                '#008080',
  'Anthropic: Claude 3.5 Sonnet':  '#d97757',
  'Google: Gemini 1.5 Pro':        '#4285f4',
  'Ollama: Llama 3 (Local)':       '#8b949e',
};

const GPT4O_COST = 0.005; // "naive" baseline cost per query

const ModelBadge = ({ name, color }) => (
  <span className="model-badge-pill" style={{ borderColor: color, color }}>
    <span className="model-badge-dot" style={{ background: color }} />
    {name}
  </span>
);

const CascadeAudit = ({ auditTrail, currentSpend, facts = [], isProcessing = false }) => {
  const [logExpanded, setLogExpanded] = useState(true);
  const [memExpanded, setMemExpanded] = useState(true);

  const latest = auditTrail[auditTrail.length - 1];
  const totalMessages = auditTrail.length;
  const naiveCost = totalMessages * GPT4O_COST;
  const actualCost = parseFloat(currentSpend) || 0;
  const savedCost = Math.max(0, naiveCost - actualCost);
  const savingsPct = naiveCost > 0 ? Math.round((savedCost / naiveCost) * 100) : 0;

  // Memory IQ: grows with facts
  const memoryIQ = Math.min(40 + facts.length * 12, 99);

  return (
    <div className="cascade-audit">

      {/* ── Header ── */}
      <div className="section-header">
        <Activity size={18} />
        <h3>Intelligence Pulse</h3>
        {isProcessing && <span className="pulse-dot" />}
      </div>

      {/* ── Stat Row ── */}
      <div className="stats-row">
        <div className="stat-chip">
          <DollarSign size={13} />
          <div>
            <div className="stat-chip-val">${actualCost.toFixed(4)}</div>
            <div className="stat-chip-lbl">Session Cost</div>
          </div>
        </div>
        <div className="stat-chip green">
          <TrendingDown size={13} />
          <div>
            <div className="stat-chip-val">{savingsPct}%</div>
            <div className="stat-chip-lbl">Saved vs GPT-4o</div>
          </div>
        </div>
        <div className="stat-chip purple">
          <Brain size={13} />
          <div>
            <div className="stat-chip-val">IQ {memoryIQ}</div>
            <div className="stat-chip-lbl">Memory Score</div>
          </div>
        </div>
      </div>

      {/* ── Cost Savings Bar ── */}
      {totalMessages > 0 && (
        <div className="savings-bar-wrap">
          <div className="savings-bar-label">
            <span>Cost Efficiency</span>
            <span style={{ color: '#238636' }}>Saved ${savedCost.toFixed(4)} vs always using GPT-4o</span>
          </div>
          <div className="savings-bar-track">
            <div
              className="savings-bar-fill"
              style={{ width: `${savingsPct}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Latest Routing Decision ── */}
      {latest ? (
        <div
          className={`routing-decision-card${isProcessing ? ' routing-pulse' : ''}`}
          style={{ borderLeftColor: MODEL_COLORS[latest.modelSelected] || '#8b949e' }}
        >
          <div className="routing-decision-header">
            <div className="routing-label">
              {isProcessing ? (
                <><span className="routing-live-dot" />ROUTING NOW</>
              ) : (
                <>LAST ROUTING DECISION</>
              )}
            </div>
          </div>
          <div className="routing-model-row">
            <Cpu size={18} style={{ color: MODEL_COLORS[latest.modelSelected] || '#8b949e', flexShrink: 0 }} />
            <ModelBadge name={latest.modelSelected} color={MODEL_COLORS[latest.modelSelected] || '#8b949e'} />
          </div>
          <div className="routing-rationale">{latest.rationale}</div>
          <div className="routing-metrics">
            <span><Clock size={12} /> {latest.latency?.toFixed(0)}ms</span>
            <span><DollarSign size={12} /> ${latest.cost?.toFixed(4)}</span>
            {latest.modelSelected?.includes('Local') && (
              <span style={{ color: '#8b949e' }}><Shield size={12} /> Private</span>
            )}
          </div>
        </div>
      ) : (
        <div className="routing-decision-card empty-routing">
          <Zap size={16} style={{ color: 'var(--primary)' }} />
          <span>Send a message — Cascadeflow will route it to the optimal AI model</span>
        </div>
      )}

      {/* ── Full Routing Log ── */}
      {auditTrail.length > 0 && (
        <div className="audit-section">
          <button
            className="audit-section-toggle"
            onClick={() => setLogExpanded(v => !v)}
          >
            <span>ROUTING LOG ({auditTrail.length} decisions)</span>
            {logExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {logExpanded && (
            <div className="audit-log-list">
              {[...auditTrail].reverse().map((entry, i) => (
                <div key={i} className="audit-log-entry">
                  <div
                    className="audit-log-bar"
                    style={{ background: MODEL_COLORS[entry.modelSelected] || '#8b949e' }}
                  />
                  <div className="audit-log-body">
                    <div className="audit-log-top">
                      <span className="audit-log-model" style={{ color: MODEL_COLORS[entry.modelSelected] || '#8b949e' }}>
                        {entry.modelSelected}
                      </span>
                      <span className="audit-log-time">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div className="audit-log-rationale">{entry.rationale}</div>
                    <div className="audit-log-metrics">
                      <span>{entry.latency?.toFixed(0)}ms</span>
                      <span>${entry.cost?.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Hindsight Memory Bank ── */}
      <div className="audit-section">
        <button
          className="audit-section-toggle purple"
          onClick={() => setMemExpanded(v => !v)}
        >
          <Brain size={13} />
          <span>HINDSIGHT MEMORY ({facts.length} facts learned)</span>
          {memExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {memExpanded && (
          <div className="memory-log-list">
            {facts.length === 0 ? (
              <div className="empty-logs">
                Aura is learning from you. Chat to build your memory profile.
              </div>
            ) : (
              [...facts].reverse().map((fact, i) => (
                <div key={i} className="memory-log-entry animate-fade-in">
                  <span className="memory-log-dot" />
                  <div className="memory-log-body">
                    <span className="memory-log-text">{fact.content}</span>
                    <span className="memory-log-time">
                      {new Date(fact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default CascadeAudit;
