import React, { useState, useEffect, useRef } from 'react';
import { Hindsight } from './lib/hindsight';
import { Cascadeflow } from './lib/cascadeflow';
import { INITIAL_MARKET_DATA } from './lib/mockData';
import ChatMessage from './components/Chat/ChatMessage';
import ChatInput from './components/Chat/ChatInput';
import CascadeAudit from './components/Intelligence/CascadeAudit';
import MemoryBank from './components/Intelligence/MemoryBank';
import PortfolioCard from './components/Sidebar/PortfolioCard';
import LoginPage from './components/Auth/LoginPage';
import UserProfile from './components/Profile/UserProfile';
import { LayoutDashboard, MessageSquare, Settings, LogOut, Zap, User, PlusCircle, Search, FolderOpen, Sparkles, MoreHorizontal, SquarePen, History } from 'lucide-react';

import Groq from 'groq-sdk';

// Initialize Groq instance
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Essential for this demo
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('afa_is_logged_in') === 'true';
  });
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('afa_token') || '';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('afa_user_email') || '';
  });

  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome back to your **Aura Agent**. I'm now connected to **Groq Cloud**. How can I assist you today?" }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditTrail, setAuditTrail] = useState([]);
  const [currentSpend, setCurrentSpend] = useState("0.0000");
  const [mentalModel, setMentalModel] = useState({ riskProfile: 'Unknown', interests: [], pastDecisions: [] });
  const [facts, setFacts] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [marketData, setMarketData] = useState(INITIAL_MARKET_DATA.indices);
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  
  // Initialize hindsight with user email if logged in
  const [hindsightInstance, setHindsightInstance] = useState(() => new Hindsight(localStorage.getItem('afa_user_email') || 'guest'));
  
  const chatEndRef = useRef(null);

  // Handle Google OAuth redirect — picks up ?token=...&user=... from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userRaw = params.get('user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        handleLogin({ token, user });
        // Clean the URL
        window.history.replaceState({}, document.title, '/');
      } catch (e) {
        console.error('OAuth redirect parse error:', e);
      }
    }
  }, []);

  // Simulated Real-Time Market Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(idx => {
        const change = (Math.random() * 0.1 - 0.05).toFixed(2);
        const newValue = parseFloat(idx.value.replace(/,/g, '')) + parseFloat(change);
        return {
          ...idx,
          value: newValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: (parseFloat(idx.change) + parseFloat(change)/100).toFixed(2) + '%',
          trend: parseFloat(change) >= 0 ? 'up' : 'down'
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserEmail(data.user.email);
    setUserToken(data.token);
    
    // Update local state with DB data
    if (data.user.mentalModel) setMentalModel(data.user.mentalModel);
    if (data.user.facts) setFacts(data.user.facts);
    const newHindsight = new Hindsight(data.user.email);
    newHindsight.hydrate(data.user);
    setHindsightInstance(newHindsight);
    setMentalModel(newHindsight.getMentalModel());
    setFacts(newHindsight.getFacts());
    
    if (data.user.auditTrail) setAuditTrail(data.user.auditTrail);
    if (data.user.totalSpend) setCurrentSpend(data.user.totalSpend.toString());
    if (data.user.conversations) setConversations(data.user.conversations);

    localStorage.setItem('afa_is_logged_in', 'true');
    localStorage.setItem('afa_user_email', data.user.email);
    localStorage.setItem('afa_token', data.token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserToken('');
    localStorage.removeItem('afa_is_logged_in');
    localStorage.removeItem('afa_user_email');
    localStorage.removeItem('afa_token');
  };

  const handleNewConversation = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: 'New Conversation',
      messages: [{ role: 'assistant', content: "New conversation started. I'm ready to assist you. How can I help?" }],
      timestamp: new Date()
    };
    
    setConversations(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setMessages(newChat.messages);
    setActiveTab('chat');
  };

  const handleUpdateProfile = (formData) => {
    // Directly update hindsight mental model with user-provided values
    hindsightInstance.memory.mentalModel = {
      ...hindsightInstance.getMentalModel(),
      ...formData,
    };
    hindsightInstance.save();
    setMentalModel(hindsightInstance.getMentalModel());
    syncToDB(hindsightInstance.getMentalModel(), hindsightInstance.getFacts(), auditTrail, currentSpend, conversations);
  };

  const syncToDB = async (updatedModel, updatedFacts, updatedTrail, updatedSpend, updatedConversations) => {
    if (!userToken) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: userToken,
          mentalModel: updatedModel,
          facts: updatedFacts,
          auditTrail: updatedTrail,
          totalSpend: parseFloat(updatedSpend),
          conversations: updatedConversations
        })
      });
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content) => {
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    const cascadeflowInstance = new Cascadeflow(1.00);
    
    try {
      // 1. Memory Recall: What do we already know?
      const relatedFacts = hindsightInstance.recall(content);
      const context = relatedFacts.map(f => f.content).join('\n');

      // 2. Intelligence Routing: Which model should answer?
      const { config, decision } = cascadeflowInstance.route(content);
      
      // 3. Update Audit Trail immediately
      setAuditTrail(cascadeflowInstance.getAuditTrail());
      setCurrentSpend(cascadeflowInstance.getSpend().toString());

      // 4. Groq Execution
      const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
      const systemPrompt = `
        You are Aura Agent, a premium financial assistant with long-term memory (Hindsight).
        
        USER IDENTITY:
        - Name: ${mentalModel.userName || 'Valued User'}
        - Risk Profile: ${mentalModel.riskProfile}
        - Interests: ${mentalModel.interests.join(', ')}
        
        LONG-TERM MEMORY (RECALLED FACTS):
        ${context || 'No specific facts recalled for this query, but you know the user from previous sessions.'}
        
        MISSION:
        Provide personalized, data-driven financial advice. Reference the user's name and past history naturally.
        Never claim you don't remember them; you have full access to their Hindsight Memory Bank.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
          { role: 'user', content }
        ],
        model: config.id,
      });

      const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      const newMessages = [...messages, { role: 'user', content }, { role: 'assistant', content: response }];
      
      // 5. Hindsight: Reflect on the interaction
      hindsightInstance.retain({ role: 'user', content });
      hindsightInstance.reflect();
      const updatedModel = hindsightInstance.getMentalModel();
      const updatedFacts = hindsightInstance.getFacts();

      setMentalModel(updatedModel);
      setFacts(updatedFacts);

      setMessages(newMessages);
      
      // Update conversations array
      setConversations(prev => {
        const updated = prev.map(chat => {
          if (chat.id === (activeChatId || 'default')) {
            return { 
              ...chat, 
              messages: newMessages,
              title: chat.title === 'New Conversation' ? content.substring(0, 30) + '...' : chat.title
            };
          }
          return chat;
        });
        
        // If no active chat exists, create one
        if (!activeChatId && !prev.find(c => c.id === 'default')) {
          const defaultChat = { id: 'default', title: content.substring(0, 30) + '...', messages: newMessages, timestamp: new Date() };
          const result = [defaultChat, ...prev];
          syncToDB(updatedModel, updatedFacts, cascadeflowInstance.getAuditTrail(), cascadeflowInstance.getSpend(), result);
          return result;
        }
        
        syncToDB(updatedModel, updatedFacts, cascadeflowInstance.getAuditTrail(), cascadeflowInstance.getSpend(), updated);
        return updated;
      });
    } catch (error) {
      console.error("Groq API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Groq. Please check your API key." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load user data on mount if already logged in
  useEffect(() => {
    const hydrateSession = async () => {
      if (isLoggedIn && userToken) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
          });
          const data = await response.json();
          if (response.ok && data.user) {
            const hydratedHindsight = new Hindsight(data.user.email);
            hydratedHindsight.hydrate(data.user);
            setHindsightInstance(hydratedHindsight);
            setMentalModel(hydratedHindsight.getMentalModel());
            setFacts(hydratedHindsight.getFacts());
            if (data.user.conversations) setConversations(data.user.conversations);
            if (data.user.auditTrail) setAuditTrail(data.user.auditTrail);
            if (data.user.totalSpend) setCurrentSpend(data.user.totalSpend.toString());
          }
        } catch (err) {
          console.error('Failed to hydrate session:', err);
        }
      }
    };
    hydrateSession();
  }, []);

  // Switch messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      const selected = conversations.find(c => c.id === activeChatId);
      if (selected) setMessages(selected.messages);
    }
  }, [activeChatId]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon"><Zap size={20} /></div>
          <span className="logo-text">Aura Agent</span>
        </div>
        
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={18} /> Chat
          </div>
          <div 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} /> History
          </div>
          <div 
            className="nav-item action-item"
            onClick={handleNewConversation}
          >
            <PlusCircle size={18} color="var(--primary)" /> New Conversation
          </div>
          <div 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile
          </div>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </div>
        </nav>

        <PortfolioCard indices={marketData} />

        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area based on Tab */}
      <main className="main-chat">
        <header className="chat-header">
          <div className="header-info">
            <h2 className="text-gradient">
              {activeTab === 'chat' ? 'Financial Strategy Session' : 
               activeTab === 'dashboard' ? 'Intelligence Dashboard' :
               activeTab === 'profile' ? 'Your Profile' : 
               activeTab === 'history' ? 'Conversation History' : 'System Settings'}
            </h2>
            <div className="status-indicator">
              <span className="dot"></span> Online
            </div>
          </div>
        </header>

        {activeTab === 'chat' && (
          <>
            <div className="messages-container">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              <div ref={chatEndRef} />
            </div>
            <ChatInput onSend={handleSend} isProcessing={isProcessing} />
          </>
        )}

        {activeTab === 'history' && (
          <div className="history-view">
            <div className="history-grid">
              {conversations.map((chat, i) => (
                <div 
                  key={chat.id} 
                  className="history-card animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setActiveTab('chat');
                  }}
                >
                  <div className="history-card-header">
                    <MessageSquare size={18} className="chat-icon" />
                    <span className="chat-date">May 16, 2026</span>
                  </div>
                  <h3>{chat.title}</h3>
                  <p className="chat-preview">
                    {i % 2 === 0 ? "Discussing financial strategy and market trends..." : "Analyzing risk profile and investment portfolio..."}
                  </p>
                  <div className="history-card-footer">
                    <span className="open-link">Resume Chat →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <UserProfile
            mentalModel={mentalModel}
            userEmail={userEmail}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Cascade Performance</h3>
                <CascadeAudit auditTrail={auditTrail} currentSpend={currentSpend} />
              </div>
              <div className="dashboard-card">
                <h3>Mental Model</h3>
                <MemoryBank mentalModel={mentalModel} facts={facts} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-view">
            <div className="settings-card">
              <h3>Cascadeflow Configuration</h3>
              <div className="setting-row">
                <label>Daily Budget Cap ($)</label>
                <input type="number" defaultValue="1.00" />
              </div>
              <div className="setting-row">
                <label>Model Routing Strategy</label>
                <select>
                  <option>Cost Optimized (Default)</option>
                  <option>Performance Optimized</option>
                  <option>Strictly Cheap Models</option>
                </select>
              </div>
              <div className="setting-row">
                <label>API Key Status</label>
                <div className="status-badge success">Active (Groq)</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Intelligence Panel (Only visible on Chat tab, otherwise it's in Dashboard) */}
      {activeTab === 'chat' && (
        <aside className="intelligence-panel">
          <CascadeAudit auditTrail={auditTrail} currentSpend={currentSpend} />
          <MemoryBank mentalModel={mentalModel} facts={facts} />
        </aside>
      )}
    </div>
  );
}

export default App;
