import React, { useState } from 'react';
import { Zap, Shield, ArrowRight } from 'lucide-react';

// Google icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 33.2 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.2 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 40.1 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.2-4.3 5.5l6.2 5.2C41.4 35.1 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
);

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL === 'http://localhost:5000' ? '' : (import.meta.env.VITE_API_URL || ''));
    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignUp ? { email, password, name } : { email, password };

    console.log(`Attempting to hit: ${apiUrl}${endpoint}`);

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
      } else {
        setError(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleApiUrl = import.meta.env.DEV ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL === 'http://localhost:5000' ? '' : (import.meta.env.VITE_API_URL || ''));
    window.location.href = `${googleApiUrl}/api/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Zap size={32} />
          </div>
          <h1>Aura Agent</h1>
          <p>{isSignUp ? 'Create your intelligence account' : 'Secure Access to Your Intelligence Bank'}</p>
        </div>

        {/* Google Login Button */}
        <button type="button" className="google-login-btn" onClick={handleGoogleLogin}>
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="login-divider">
          <span>{isSignUp ? 'or register with email' : 'or continue with email'}</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{isSignUp ? 'Create Password' : 'Master Password'}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Authenticating...' : <><span>{isSignUp ? 'Create Account' : 'Launch Agent'}</span> <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? (
            <p>Already have an account? <span onClick={() => setIsSignUp(false)}>Login here</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setIsSignUp(true)}>Sign up here</span></p>
          )}
        </div>

        <div className="login-footer">
          <div className="security-note">
            <Shield size={14} />
            <span>End-to-End Encrypted Strategy Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
