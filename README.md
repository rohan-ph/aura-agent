# Aura Agent 🚀

A high-fidelity AI-powered financial assistant built with **React + Groq Cloud**, featuring persistent memory via **Hindsight** and intelligent model routing via **Cascadeflow**.

## ✨ Features

- **Real AI Chat** — Powered by Groq Cloud (Llama 3.1 & 3.3 models)
- **Persistent Memory (Hindsight)** — Remembers your name, risk profile, and investment history across sessions
- **Intelligent Model Routing (Cascadeflow)** — Routes simple queries to fast cheap models, complex ones to powerful models
- **Real-Time Market Pulse** — Live-updating market indices (Nifty 50, Sensex, Nasdaq)
- **User Profile** — Edit your risk appetite, occupation, and investment goals directly
- **Authentication** — Email/password login + Google OAuth
- **MongoDB Backend** — Secure cloud persistence of your memory bank and audit trail

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Vanilla CSS (Glassmorphism) |
| AI | Groq Cloud (Llama 3.1 / 3.3) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth (Passport.js) |

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/adaptive-fin-agent.git
cd adaptive-fin-agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_GROQ_API_KEY=your_groq_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adaptive_fin_agent
JWT_SECRET=your_jwt_secret
PORT=5000
VITE_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

### 4. Start the backend
```bash
node server/index.cjs
```

### 5. Start the frontend
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 📁 Project Structure

```
adaptive-fin-agent/
├── src/
│   ├── components/
│   │   ├── Auth/          # Login page with Google OAuth
│   │   ├── Chat/          # Chat messages and input
│   │   ├── Intelligence/  # CascadeAudit and MemoryBank panels
│   │   ├── Profile/       # User profile editor
│   │   └── Sidebar/       # Market pulse widget
│   ├── lib/
│   │   ├── hindsight.js   # Persistent memory engine
│   │   ├── cascadeflow.js # Intelligent model router
│   │   └── mockData.js    # Initial market data
│   ├── App.jsx
│   └── index.css
├── server/
│   ├── index.cjs          # Express backend
│   └── models/
│       └── User.cjs       # MongoDB user schema
└── README.md
```

## 🔑 Getting API Keys

- **Groq API**: [console.groq.com](https://console.groq.com)
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Google OAuth**: [console.cloud.google.com](https://console.cloud.google.com)
