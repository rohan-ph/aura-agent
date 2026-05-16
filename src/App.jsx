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
import { LayoutDashboard, MessageSquare, Settings, LogOut, Zap, User, PlusCircle } from 'lucide-react';

import Groq from 'groq-sdk';

// Initialize instances
const hindsight = new Hindsight();
const cascadeflow = new Cascadeflow(1.00); // $1.00 budget
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
  const [mentalModel, setMentalModel] = useState(hindsight.getMentalModel());
  const [facts, setFacts] = useState(hindsight.getFacts());
  const [activeTab, setActiveTab] = useState('chat');
  const [marketData, setMarketData] = useState(INITIAL_MARKET_DATA.indices);
  
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
    if (data.user.auditTrail) setAuditTrail(data.user.auditTrail);
    if (data.user.totalSpend) setCurrentSpend(data.user.totalSpend.toString());

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
    setMessages([
      { role: 'assistant', content: "New conversation started. I still have access to your **Hindsight** memory bank. How can I help you next?" }
    ]);
    setActiveTab('chat');
  };

  const handleUpdateProfile = (formData) => {
    // Directly update hindsight mental model with user-provided values
    hindsight.memory.mentalModel = {
      ...hindsight.getMentalModel(),
      ...formData,
    };
    hindsight.save();
    setMentalModel(hindsight.getMentalModel());
    syncToDB(hindsight.getMentalModel(), hindsight.getFacts(), auditTrail, currentSpend);
  };

  const syncToDB = async (updatedModel, updatedFacts, updatedTrail, updatedSpend) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: userToken,
          mentalModel: updatedModel,
          facts: updatedFacts,
          auditTrail: updatedTrail,
          totalSpend: parseFloat(updatedSpend)
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

    try {
      // 1. Cascadeflow: Route and select model
      const { config, decision } = cascadeflow.route(content);
      setAuditTrail(cascadeflow.getAuditTrail());
      setCurrentSpend(cascadeflow.getSpend());

      // 2. Hindsight: Retain facts and recall context
      hindsight.retain(userMessage);
      const recalledFacts = hindsight.recall(content);
      const model = hindsight.getMentalModel();
      
      // 3. Construct Contextual Prompt
      const systemPrompt = `
        You are an Adaptive Financial Analysis Agent. 
        User Name: ${model.userName || 'Valued User'}
        Current User Context: ${JSON.stringify(model)}
        Recalled Facts: ${JSON.stringify(recalledFacts)}
        
        Guidelines:
        - Be professional and data-driven.
        - Reference the user's name if known: ${model.userName || 'the user'}.
        - Reference the user's past history (e.g. crypto experience) if relevant.
        - If the user asks about risk, acknowledge their current risk profile: ${model.riskProfile}.
      `;

      // 4. Call Real Groq API
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: content }
        ],
        model: config.id,
      });

      const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      // 5. Hindsight: Reflect on the interaction
      hindsight.reflect();
      const updatedModel = hindsight.getMentalModel();
      const updatedFacts = hindsight.getFacts();
      
      setMentalModel(updatedModel);
      setFacts(updatedFacts);

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // 6. Sync to MongoDB
      syncToDB(updatedModel, updatedFacts, cascadeflow.getAuditTrail(), cascadeflow.getSpend());
    } catch (error) {
      console.error("Groq API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Groq. Please check your API key." }]);
    } finally {
      setIsProcessing(false);
    }
  };

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
            className="nav-item action-item"
            onClick={handleNewConversation}
          >
            <PlusCircle size={18} color="var(--primary)" /> New Conversation
          </div>
          <div 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={18} /> Chat
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
          <div className="nav-item" onClick={handleLogout}><LogOut size={18} /> Logout</div>
        </div>
      </aside>

      {/* Main Content Area based on Tab */}
      <main className="main-chat">
        <header className="chat-header">
          <div className="header-info">
            <h2 className="text-gradient">
              {activeTab === 'chat' ? 'Financial Strategy Session' : 
               activeTab === 'dashboard' ? 'Intelligence Dashboard' :
               activeTab === 'profile' ? 'Your Profile' : 'System Settings'}
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
