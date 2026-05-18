import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Cpu, ChevronRight } from 'lucide-react';

// Inline complexity analysis (mirrors cascadeflow.js logic)
const analyzeComplexity = (query) => {
  let score = 0;
  const q = query.toLowerCase();
  if (q.includes('calculate') || q.includes('math') || q.includes('formula') || q.includes('tax') || q.includes('interest')) score += 4;
  if (q.includes('compare') || q.includes('vs') || q.includes('difference')) score += 3;
  if (q.includes('impact') || q.includes('analyze') || q.includes('future') || q.includes('forecast')) score += 5;
  if (q.includes('sebi') || q.includes('regulation') || q.includes('legal') || q.includes('law') || q.includes('compliance')) score += 6;
  if (q.includes('long-term') || q.includes('portfolio') || q.includes('strategy') || q.includes('planning')) score += 5;
  if (q.includes('optimize') || q.includes('risk modeling') || q.includes('scenario') || q.includes('stress test')) score += 8;
  if (q.includes('valuation') || q.includes('dcf') || q.includes('black-scholes') || q.includes('derivative')) score += 8;
  if (q.length > 300) score += 5;
  else if (q.length > 150) score += 3;
  else if (q.length > 50) score += 1;
  return score;
};

const getRoutingPreview = (score, query, strategy = 'Cost Optimized') => {
  const q = query.toLowerCase();
  
  if (q.includes('password') || q.includes('private') || q.includes('secret') || q.includes('ssn') || q.includes('key'))
    return { model: 'Ollama: Llama 3 (Local)', color: '#ffffff', label: 'PRIVATE', tier: 'private' };

  if (strategy === 'Strictly Cheap Models') {
    if (score >= 12)
      return { model: 'OpenAI: GPT-4o Mini', color: '#10a37f', label: 'MEDIUM', tier: 'balanced' };
    return { model: 'Groq: Llama 3.1 8B', color: '#238636', label: 'SIMPLE', tier: 'fast' };
  }

  if (strategy === 'Performance Optimized') {
    if (score >= 5)
      return { model: 'OpenAI: GPT-4o', color: '#008080', label: 'EXTREME', tier: 'power' };
    if (q.includes('sebi') || q.includes('regulation') || q.includes('legal') || q.includes('compliance'))
      return { model: 'Anthropic: Claude 3.5', color: '#d97757', label: 'HIGH', tier: 'power' };
    return { model: 'Google: Gemini 1.5 Pro', color: '#4285f4', label: 'HIGH', tier: 'power' };
  }

  // Cost Optimized (Default)
  if (score >= 14)
    return { model: 'OpenAI: GPT-4o', color: '#008080', label: 'EXTREME', tier: 'power' };
  if (score >= 9) {
    if (q.includes('sebi') || q.includes('regulation') || q.includes('legal') || q.includes('compliance'))
      return { model: 'Anthropic: Claude 3.5', color: '#d97757', label: 'HIGH', tier: 'power' };
    return { model: 'Google: Gemini 1.5 Pro', color: '#4285f4', label: 'HIGH', tier: 'power' };
  }
  if (score >= 5)
    return { model: 'OpenAI: GPT-4o Mini', color: '#10a37f', label: 'MEDIUM', tier: 'balanced' };
  return { model: 'Groq: Llama 3.1 8B', color: '#238636', label: 'SIMPLE', tier: 'fast' };
};

const ChatInput = ({ onSend, isProcessing, routingStrategy = 'Cost Optimized' }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSend(input);
      setInput('');
    }
  };

  const score = analyzeComplexity(input);
  const preview = getRoutingPreview(score, input, routingStrategy);
  const showPreview = input.trim().length > 3;

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      {/* Routing Preview Bar */}
      {showPreview && (
        <div className="routing-preview animate-fade-in">
          <Cpu size={11} style={{ color: preview.color, flexShrink: 0 }} />
          <span className="routing-preview-label" style={{ color: preview.color }}>
            {preview.label}
          </span>
          <ChevronRight size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span className="routing-preview-model">{preview.model}</span>
          <div className="complexity-bar-wrap">
            <div
              className="complexity-bar-fill"
              style={{
                width: `${Math.min((score / 16) * 100, 100)}%`,
                background: preview.color,
              }}
            />
          </div>
          <span className="routing-preview-score">Score {score}</span>
        </div>
      )}

      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your portfolio, risk, or market impact..."
          disabled={isProcessing}
        />
        <button type="submit" disabled={!input.trim() || isProcessing}>
          {isProcessing ? (
            <div className="spinner" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      <div className="input-footer">
        <Zap size={12} style={{ color: 'var(--primary)' }} />
        <span>Powered by Cascadeflow routing + Hindsight memory</span>
      </div>
    </form>
  );
};

export default ChatInput;
