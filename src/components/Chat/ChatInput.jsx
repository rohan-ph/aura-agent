import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';

const ChatInput = ({ onSend, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
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
        <span>Powered by Cascadeflow & Hindsight</span>
      </div>
    </form>
  );
};

export default ChatInput;
