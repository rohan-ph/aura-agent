import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Brain, ChevronDown, ChevronUp } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [memExpanded, setMemExpanded] = useState(false);
  const memoryContext = message.memoryContext; // array of { content, timestamp }

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'} animate-fade-in`}>
      <div className="message-icon">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="message-content">
        <div className="message-header">
          {isUser ? 'You' : 'Aura Agent'}
        </div>
        <div className="message-body">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Memory Context Pill — only on assistant messages with recalled facts */}
        {!isUser && memoryContext && memoryContext.length > 0 && (
          <div className="memory-context-wrap">
            <button
              className="memory-pill"
              onClick={() => setMemExpanded(v => !v)}
            >
              <Brain size={12} />
              <span>Built on {memoryContext.length} memor{memoryContext.length === 1 ? 'y' : 'ies'}</span>
              {memExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {memExpanded && (
              <div className="memory-pill-expanded animate-fade-in">
                <div className="memory-pill-title">Hindsight facts recalled for this response:</div>
                {memoryContext.map((fact, i) => (
                  <div key={i} className="memory-pill-fact">
                    <span className="memory-pill-dot" />
                    <span>{fact.content}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
