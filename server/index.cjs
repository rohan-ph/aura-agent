require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User.cjs');

const app = express();
app.use(express.json());
app.use(cors()); // Allow all origins for debugging connectivity
app.use(session({
  secret: process.env.SESSION_SECRET || 'afa_session_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'afa_secret_key';

let isDbConnected = false;
const inMemoryUsers = {}; // Fallback in-memory store

// ─── MongoDB Connection ─────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => { console.log('✅ Connected to MongoDB Atlas'); isDbConnected = true; })
  .catch(err => { console.error('⚠️  MongoDB offline — Fallback Mode active:', err.message); });

// ─── Passport Google Strategy ───────────────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    if (isDbConnected) {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          email,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          mentalModel: { userName: name, riskProfile: 'Unknown', interests: [], pastDecisions: [] }
        });
        await user.save();
      }
      return done(null, { _id: user._id, email, name, mentalModel: user.mentalModel, facts: user.facts, totalSpend: user.totalSpend, auditTrail: user.auditTrail, conversations: user.conversations });
    } else {
      // Fallback
      if (!inMemoryUsers[email]) {
        inMemoryUsers[email] = { email, name, mentalModel: { userName: name, riskProfile: 'Unknown', interests: [] }, facts: [], totalSpend: 0, auditTrail: [], conversations: [] };
      }
      return done(null, inMemoryUsers[email]);
    }
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ─── Email/Password Auth Routes ─────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (isDbConnected) {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ 
        email, 
        password: hashedPassword,
        mentalModel: { userName: name, riskProfile: 'Unknown', interests: [], pastDecisions: [] }
      });
      await user.save();
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { email: user.email, name, mentalModel: user.mentalModel, facts: [], totalSpend: 0, auditTrail: [], conversations: [] } });
    } else {
      // Fallback Mode
      if (inMemoryUsers[email]) return res.status(400).json({ message: 'User already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      inMemoryUsers[email] = { email, password: hashedPassword, name, mentalModel: { userName: name, riskProfile: 'Unknown', interests: [] }, facts: [], totalSpend: 0, auditTrail: [], conversations: [] };
      const token = jwt.sign({ userId: `demo_${email}` }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: inMemoryUsers[email] });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (isDbConnected) {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { email: user.email, mentalModel: user.mentalModel, facts: user.facts, totalSpend: user.totalSpend, auditTrail: user.auditTrail, conversations: user.conversations } });
    } else {
      // Fallback Mode
      let memUser = inMemoryUsers[email];
      if (!memUser) return res.status(400).json({ message: 'User not found' });
      
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = jwt.sign({ userId: `demo_${email}` }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: memUser });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Google OAuth Routes ─────────────────────────────────────────────────────
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/?error=google_failed' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ userId: user._id || `demo_${user.email}` }, JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

// ─── Data Sync Route ─────────────────────────────────────────────────────────
app.post('/api/user/sync', async (req, res) => {
  const { token, mentalModel, facts, auditTrail, totalSpend, conversations } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (isDbConnected && !String(decoded.userId).startsWith('demo_')) {
      const user = await User.findByIdAndUpdate(decoded.userId, { mentalModel, facts, auditTrail, totalSpend, conversations }, { new: true });
      return res.json({ message: 'Sync successful', user });
    } else if (String(decoded.userId).startsWith('demo_')) {
      const email = String(decoded.userId).replace('demo_', '');
      inMemoryUsers[email] = { ...inMemoryUsers[email], mentalModel, facts, auditTrail, totalSpend, conversations };
      return res.json({ message: 'Sync successful (Fallback Mode)', user: inMemoryUsers[email] });
    }
    return res.status(400).json({ message: 'Sync failed' });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// ─── Profile Route ───────────────────────────────────────────────────────────
app.get('/api/user/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (isDbConnected && !String(decoded.userId).startsWith('demo_')) {
      const user = await User.findById(decoded.userId);
      return res.json({ user });
    } else if (String(decoded.userId).startsWith('demo_')) {
      const email = String(decoded.userId).replace('demo_', '');
      return res.json({ user: inMemoryUsers[email] });
    }
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
