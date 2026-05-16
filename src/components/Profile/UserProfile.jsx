import React, { useState } from 'react';
import { User, Shield, TrendingUp, Briefcase, Edit2, Check, X } from 'lucide-react';

const riskOptions = ['Low', 'Medium', 'High'];

const UserProfile = ({ mentalModel, userEmail, onUpdateProfile }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    userName: mentalModel.userName || '',
    riskProfile: mentalModel.riskProfile || 'Unknown',
    occupation: mentalModel.occupation || '',
    investmentGoal: mentalModel.investmentGoal || '',
  });

  const handleSave = () => {
    onUpdateProfile(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      userName: mentalModel.userName || '',
      riskProfile: mentalModel.riskProfile || 'Unknown',
      occupation: mentalModel.occupation || '',
      investmentGoal: mentalModel.investmentGoal || '',
    });
    setEditing(false);
  };

  const getRiskColor = (risk) => {
    if (risk === 'High') return '#f85149';
    if (risk === 'Medium') return '#e3b341';
    if (risk === 'Low') return '#238636';
    return '#8b949e';
  };

  return (
    <div className="profile-view">
      <div className="profile-hero">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <div className="profile-hero-info">
          <h2>{mentalModel.userName || 'Anonymous Investor'}</h2>
          <p className="profile-email">{userEmail}</p>
          <div className="profile-risk-badge" style={{ borderColor: getRiskColor(mentalModel.riskProfile), color: getRiskColor(mentalModel.riskProfile) }}>
            <Shield size={12} />
            {mentalModel.riskProfile || 'Unknown'} Risk
          </div>
        </div>
        <button className="edit-profile-btn" onClick={() => setEditing(!editing)}>
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      {editing ? (
        <div className="profile-card">
          <h3>Edit Your Profile</h3>
          <div className="profile-form">
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={form.userName}
                onChange={e => setForm({ ...form, userName: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label>Risk Appetite</label>
              <div className="risk-selector">
                {riskOptions.map(r => (
                  <button
                    key={r}
                    className={`risk-option ${form.riskProfile === r ? 'selected' : ''}`}
                    style={form.riskProfile === r ? { background: getRiskColor(r), borderColor: getRiskColor(r) } : {}}
                    onClick={() => setForm({ ...form, riskProfile: r })}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                value={form.occupation}
                onChange={e => setForm({ ...form, occupation: e.target.value })}
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="form-group">
              <label>Investment Goal</label>
              <input
                type="text"
                value={form.investmentGoal}
                onChange={e => setForm({ ...form, investmentGoal: e.target.value })}
                placeholder="e.g. Long-term wealth creation"
              />
            </div>
            <div className="profile-form-actions">
              <button className="save-btn" onClick={handleSave}><Check size={16} /> Save</button>
              <button className="cancel-btn" onClick={handleCancel}><X size={16} /> Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-cards-grid">
          <div className="profile-info-card">
            <div className="profile-info-icon" style={{ background: 'rgba(31,111,235,0.1)', color: '#1f6feb' }}>
              <User size={20} />
            </div>
            <div>
              <div className="profile-info-label">Display Name</div>
              <div className="profile-info-value">{mentalModel.userName || 'Not set'}</div>
            </div>
          </div>
          <div className="profile-info-card">
            <div className="profile-info-icon" style={{ background: `rgba(${mentalModel.riskProfile === 'High' ? '248,81,73' : mentalModel.riskProfile === 'Medium' ? '227,179,65' : '35,134,54'},0.1)`, color: getRiskColor(mentalModel.riskProfile) }}>
              <Shield size={20} />
            </div>
            <div>
              <div className="profile-info-label">Risk Appetite</div>
              <div className="profile-info-value">{mentalModel.riskProfile || 'Unknown'}</div>
            </div>
          </div>
          <div className="profile-info-card">
            <div className="profile-info-icon" style={{ background: 'rgba(35,134,54,0.1)', color: '#238636' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="profile-info-label">Occupation</div>
              <div className="profile-info-value">{mentalModel.occupation || 'Not set'}</div>
            </div>
          </div>
          <div className="profile-info-card">
            <div className="profile-info-icon" style={{ background: 'rgba(163,113,247,0.1)', color: '#a371f7' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="profile-info-label">Investment Goal</div>
              <div className="profile-info-value">{mentalModel.investmentGoal || 'Not set'}</div>
            </div>
          </div>
          <div className="profile-info-card wide">
            <div className="profile-info-icon" style={{ background: 'rgba(31,111,235,0.1)', color: '#1f6feb' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="profile-info-label">Interests</div>
              <div className="profile-interests">
                {mentalModel.interests && mentalModel.interests.length > 0
                  ? mentalModel.interests.map((i, idx) => <span key={idx} className="interest-tag">{i}</span>)
                  : <span className="profile-info-value">None detected yet</span>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
