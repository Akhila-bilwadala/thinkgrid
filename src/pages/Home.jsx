import React, { useState } from 'react';
import { Send, RefreshCw, Users, BookOpen, Zap, Star, ArrowRight, CheckCircle, Shield, MapPin, Award, TrendingUp } from 'lucide-react';
import './Home.css';

const QUICK_SHORTCUTS = [
    { id: 'explore', label: 'Materials Hub', desc: 'Browse study resources', icon: <BookOpen size={28} />, color: '#F3F4F6' },
    { id: 'rooms', label: 'Skill Exchange', desc: 'Trade & learn skills', icon: <RefreshCw size={28} />, color: '#F3F4F6' },
    { id: 'labs', label: 'Active Labs', desc: 'Join live sessions', icon: <Zap size={28} />, color: '#F3F4F6' },
];

export default function Home({ onNavigate }) {
    const [skillTarget, setSkillTarget] = useState('');
    const [skillType, setSkillType] = useState('');
    const [credits, setCredits] = useState('50');
    const [requestTab, setRequestTab] = useState('request');

    return (
        <div className="dash-layout">

            {/* ── LEFT COLUMN ── */}
            <div className="dash-col dash-col-left">

                {/* Skill Points Card */}
                <div className="dash-card points-card">
                    <div className="card-label-row">
                        <span className="card-label">Skill Points</span>
                        <div className="points-icon-btn">
                            <Star size={14} />
                        </div>
                    </div>
                    <div className="points-amount">2,840 <span className="points-unit">pts</span></div>
                    <div className="points-stats">
                        <span className="stat-up">↗ +320 earned</span>
                        <span className="stat-down">↘ −90 spent</span>
                    </div>
                </div>

                {/* Profile Info Card */}
                <div className="dash-card info-card">
                    <div className="card-label-row">
                        <span className="card-label">My Profile</span>
                        <button className="icon-action-btn">✏️</button>
                    </div>
                    <div className="info-rows">
                        <div className="info-row">
                            <MapPin size={14} className="info-icon" />
                            <span className="info-key">Location</span>
                            <span className="info-val">Hyderabad</span>
                        </div>
                        <div className="info-row">
                            <Award size={14} className="info-icon" />
                            <span className="info-key">Top Skill</span>
                            <span className="info-val">React.js</span>
                        </div>
                        <div className="info-row">
                            <Users size={14} className="info-icon" />
                            <span className="info-key">Rank</span>
                            <span className="info-val">Mentor #42</span>
                        </div>
                        <div className="info-row">
                            <TrendingUp size={14} className="info-icon" />
                            <span className="info-key">Streak</span>
                            <span className="info-val">12 days 🔥</span>
                        </div>
                    </div>
                </div>

                {/* Account Status Card */}
                <div className="dash-card status-card">
                    <div className="card-label-row">
                        <span className="card-label">Account Status</span>
                        <span className="three-dots">···</span>
                    </div>
                    <div className="status-row">
                        <div className="status-icon verified">
                            <Shield size={14} />
                        </div>
                        <span className="status-text">Identity Verified</span>
                        <div className="status-toggle active-toggle" />
                    </div>
                    <div className="status-row">
                        <div className="status-icon">
                            <Star size={14} />
                        </div>
                        <span className="status-text">Mentor Badge</span>
                        <button className="btn-status-action">Upgrade</button>
                    </div>
                </div>

            </div>

            {/* ── MIDDLE COLUMN ── */}
            <div className="dash-col dash-col-mid">

                {/* Member Card + Quick Stats */}
                <div className="member-card-wrapper">
                    <div className="member-card">
                        <div className="member-card-bg" />
                        <div className="member-card-content">
                            <div className="mc-brand">
                                <div className="mc-logo-dot" />
                                <span>thinkgrid</span>
                            </div>
                            <div className="mc-chips">
                                <span>2.8k</span>
                                <span>350</span>
                                <span>92</span>
                                <span>18</span>
                            </div>
                            <div className="mc-points">2,840 pts</div>
                            <div className="mc-meta">
                                <div className="mc-avatar" />
                                <span className="mc-name">ThinkGrid Pro</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collaboration Panel */}
                <div className="dash-card collab-card">
                    <div className="card-label-row">
                        <span className="card-label">Start Collaboration</span>
                    </div>

                    {/* Tabs */}
                    <div className="collab-tabs">
                        <button
                            className={`ctab ${requestTab === 'request' ? 'active' : ''}`}
                            onClick={() => setRequestTab('request')}
                        >
                            Request Skill
                        </button>
                        <button
                            className={`ctab ${requestTab === 'offer' ? 'active' : ''}`}
                            onClick={() => setRequestTab('offer')}
                        >
                            Offer Skill
                        </button>
                    </div>

                    <div className="collab-body">
                        <label className="input-label">Find a Mentor or Peer</label>
                        <input
                            className="collab-input"
                            placeholder="Enter username or skill (e.g. React.js, AI)"
                            value={skillTarget}
                            onChange={e => setSkillTarget(e.target.value)}
                        />
                        <p className="input-hint">Search for a mentor or start an open request.</p>

                        <div className="collab-row-2">
                            <div className="input-group-half">
                                <label className="input-label">Credits to Offer</label>
                                <div className="number-input">
                                    <span className="n-currency">⚡</span>
                                    <input
                                        type="number"
                                        value={credits}
                                        onChange={e => setCredits(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-group-half">
                                <label className="input-label">Skill Topic</label>
                                <input
                                    className="collab-input"
                                    placeholder="e.g. Machine Learning"
                                    value={skillType}
                                    onChange={e => setSkillType(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="collab-fee-row">
                            <span>Platform Fee: <strong>5 pts</strong></span>
                            <span>Total: <strong>{Math.max(0, parseInt(credits || 0) + 5)} pts</strong></span>
                        </div>

                        <button className="btn-send-collab">
                            <Send size={15} />
                            Send Request
                        </button>
                    </div>
                </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="dash-col dash-col-right">
                {QUICK_SHORTCUTS.map(sc => (
                    <button
                        key={sc.id}
                        className="shortcut-card"
                        onClick={() => onNavigate && onNavigate(sc.id)}
                    >
                        <div className="sc-icon">{sc.icon}</div>
                        <div className="sc-text">
                            <span className="sc-label">{sc.label}</span>
                            <span className="sc-desc">{sc.desc}</span>
                        </div>
                        <ArrowRight size={16} className="sc-arrow" />
                    </button>
                ))}
            </div>

        </div>
    );
}
