# 🌌 Aura Financial Agent

A premium, high-fidelity AI-powered financial intelligence agent. Built on a state-of-the-art glassmorphism React client and a robust Node.js backend, Aura is powered by two proprietary architectural engines: **Cascadeflow** (an intelligent multi-provider routing matrix) and **Hindsight** (a persistent semantic memory bank).

🌌 **Live Production Demo**: [https://adaptive-fin-agent.vercel.app/](https://adaptive-fin-agent.vercel.app/)

---

## ⚡ Core Architecture & Engines

### 1. Cascadeflow: Intelligent Model Routing
To optimize both cost efficiency and cognitive accuracy, Aura does not rely on a single LLM. Instead, the **Cascadeflow** engine analyzes incoming user requests in real time using a complexity scoring formula and routes the query to the most suitable LLM.

#### 📊 Complexity Scoring Formula
Every prompt is scanned across several difficulty vectors:
* **Extreme Math / Advanced Valuations** (`dcf`, `valuation`, `derivative`, etc.): **+8 points**
* **Risk Modeling & Stress Scenarios** (`optimize`, `stress test`, `scenario`, etc.): **+8 points**
* **Regulatory Compliance & Policy** (`sebi`, `regulation`, `compliance`, etc.): **+6 points**
* **Macroeconomic Analysis & Forecasting** (`analyze`, `impact`, `forecast`, etc.): **+5 points**
* **Strategic & Long-term Portfolio Planning** (`long-term`, `portfolio`, etc.): **+5 points**
* **Calculations, Formulae, or Tax Queries** (`calculate`, `formula`, `tax`, etc.): **+4 points**
* **Comparisons & Discrepancies** (`compare`, `vs`, `difference`, etc.): **+3 points**
* **Length-based Context Scaling**: 
  * `> 300` characters: **+5 points**
  * `151 - 300` characters: **+3 points**
  * `51 - 150` characters: **+1 point**

#### 🎯 Routing Matrices (By Strategy)

| Active Strategy | Score Range | Assigned Model | Cognitive Class | Focus Area |
| :--- | :--- | :--- | :--- | :--- |
| **All Strategies** | *Privacy Keyword* | **Ollama: Llama 3 (Local)** | Private | Local, secure data protection |
| **Cost Optimized** (Default) | `< 5` | **Groq: Llama 3.1 8B** | Simple / Turbo | Lightning-fast baseline chat |
| | `5 - 8` | **OpenAI: GPT-4o Mini** | Medium / Balanced | Intermediate math & tax equations |
| | `9 - 13` *(with Legal terms)* | **Anthropic: Claude 3.5 Sonnet** | High / Regulatory | Compliance, policy, SEBI, legal |
| | `9 - 13` *(other terms)* | **Google: Gemini 1.5 Pro** | High / Analyst | Large context data analysis & trends |
| | `>= 14` | **OpenAI: GPT-4o** | Extreme | High reasoning math & risk modeling |
| **Performance Optimized** | `< 5` | **Google: Gemini 1.5 Pro** | High / Analyst | Deep analyst responses |
| | `>= 5` | **OpenAI: GPT-4o** | Extreme | Full-scale reasoning override |
| **Strictly Cheap** | `< 12` | **Groq: Llama 3.1 8B** | Simple / Turbo | Budget limits protection |
| | `>= 12` | **OpenAI: GPT-4o Mini** | Medium / Balanced | Maximum capability cap |

---

### 2. Hindsight: Persistent Memory Bank
**Hindsight** extracts deep personal, financial, and strategic facts from your conversational context and persists them across sessions in your secure MongoDB user profile.
* **Context Hydration**: Every message sent is dynamically prepended with your learned facts so the models maintain a high-fidelity "mental model" of your profile without you re-entering it.
* **Global Fact Recall**: Fully optimized fact retrieval that queries the complete set of learned memories/facts instead of restricted keyword-filtered or truncated subsets, boosting contextual intelligence across all LLM tiers.
* **Memory IQ Metric**: The application computes a dynamic **Memory IQ** based on learned insights (`IQ = Math.min(40 + learnedFacts * 12, 99)`), showing you the depth of your assistant's customized context.

---

## ✨ Premium Features & Design System

* **Premium Glassmorphism Dark Theme**: Harmonies of semi-transparent blurs, vibrant HSL tail-colors, custom gradients, and micro-interactions.
* **Intelligence Pulse Sidepanel (HUD)**: Real-time HUD displaying session costs, saved dollars compared to running GPT-4o exclusively, live routing logs, and learned hindsight memories.
* **Interactive Routing Preview Bar**: Shows a real-time progress bar, score calculation, and model selection before you hit send.
* **Full Mobile & Tablet Responsiveness**: A completely optimized responsive layout featuring:
  * **Tablet View**: Interactive slide-in sidebar overlay triggered by a sleek custom menu button.
  * **Mobile View**: High-fidelity bottom navigation bar optimized for thumbs, hiding non-critical desktop panels to prioritize screen space.
  * **Unified Scale**: Gracefully scaled viewports with fluid CSS and responsive flex structures.
* **Live Market Ticker**: Integrated dashboard with mock live-updating Nifty 50, Sensex, and Nasdaq market metrics.
* **Non-Blocking Confirmations**: Replaced native blocking alerts (`window.confirm`) with seamless, instant inline buttons for actions like chat deletion to maintain UI fluidity.
* **Robust Session Retention**: Resolved session preservation and live memory updates on page refresh to ensure user journeys are never disrupted.
* **Anti-Compression Flexbox Polish**: Custom CSS properties (`flex-shrink: 0`) added to audit logs and memory cards to prevent item squishing under high chat volume.

---

## 🛠️ Technical Stack

* **Frontend**: React 19 + Vite 8
* **Styling**: Vanilla CSS custom variables, glassmorphic layout, fluid animations
* **Backend**: Node.js + Express 5 + Passport.js (Google OAuth 2.0)
* **Database**: MongoDB Atlas via Mongoose 9
* **AI Providers**: Groq SDK, OpenAI SDK, Gemini SDK, Claude SDK, Ollama (Local)

---

## 📦 Vercel Deployment & Serverless Integration
Aura is configured for instant Vercel hosting using a serverless structure:
* **Serverless Entrypoint (`api/index.js`)**: Adapts the Express app to act as an asynchronous serverless function on Vercel.
* **Rewrites & Routes (`vercel.json`)**: Seamlessly directs `/api/*` requests to our serverless backend, while all other client-side routing is handled by the Vite single-page application.

---

## 🚀 Getting Started

### 1. Clone & Initialize
```bash
git clone https://github.com/rohan-ph/aura-agent.git
cd aura-agent
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Frontend Config
VITE_API_URL=https://adaptive-fin-agent.vercel.app   # Update for production or use http://localhost:5000 locally
VITE_GROQ_API_KEY=your_groq_cloud_api_key

# Backend Config
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aura_agent
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_express_session_secret

# OAuth Config (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://adaptive-fin-agent.vercel.app/api/auth/google/callback
```

### 3. Launch Development Server

#### Running the Backend
```bash
node server/index.cjs
```

#### Running the Frontend (Vite Client)
```bash
npm run dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to load the interface.

---

## 📁 Directory Architecture

```
adaptive-fin-agent/
├── api/
│   └── index.js           # Vercel serverless endpoint wrapper
├── src/
│   ├── components/
│   │   ├── Auth/          # Login, Registration & Google OAuth triggers
│   │   ├── Chat/          # Message items, Markdown renderers, Input with Previewer
│   │   ├── Intelligence/  # CascadeAudit panels & Hindsight memory logs
│   │   ├── Profile/       # Risk profile, occupation, and financial goal editors
│   │   └── Sidebar/       # Navigation panels & Live Market Pulse widget
│   ├── lib/
│   │   ├── hindsight.js   # Memory compilation, state extraction, and injection
│   │   ├── cascadeflow.js # Query scoring, token cost weights, strategy routing
│   │   └── mockData.js    # Default market feeds and model profiles
│   ├── App.jsx            # State coordinator and route coordinator
│   └── index.css          # Premium glassmorphism dark system styling
├── server/
│   ├── index.cjs          # Express Server with Passport OAuth and fallback systems
│   └── models/
│       └── User.cjs       # MongoDB Mongoose collection schemas
├── vercel.json            # Vercel Serverless routing deployment config
└── README.md
```

---

## 🔒 Security & Privacy
* **LLM Payload Sanitization**: Message history and user facts payloads are thoroughly sanitized before transmission to multi-provider LLM models to prevent schema validation crashes and respect prompt boundaries.
* **Local Privacy Tiers**: Aura values your financial data privacy. The local model tier runs fully offline via **Ollama (Llama 3)**, guaranteeing that highly sensitive assets (keys, passwords, bank numbers) never leave your physical machine.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for details.
