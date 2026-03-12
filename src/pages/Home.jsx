import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, Users, BookOpen, Zap, Star, ArrowRight, Shield, MapPin, Award, TrendingUp, MessageSquare, Briefcase, Building2 } from 'lucide-react';
import './Home.css';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/users';

const QUICK_SHORTCUTS = [
    { id: 'explore', label: 'Connect', desc: 'Collaborate with the community', icon: <Users size={28} />, color: '#F3F4F6' },
    { id: 'rooms', label: 'Discussions Room', desc: 'Join topic-based groups', icon: <MessageSquare size={28} />, color: '#F3F4F6' },
    { id: 'labs', label: 'Active Labs', desc: 'Join live sessions', icon: <Zap size={28} />, color: '#F3F4F6' },
];

export default function Home({ onNavigate }) {
    const { user: authUser } = useAuth();
    const [skillTarget, setSkillTarget] = useState('');
    const [skillType, setSkillType] = useState('');
    const [credits, setCredits] = useState('50');
    const [loading, setLoading] = useState(true);

    // Profile State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profile, setProfile] = useState({
        role: 'Software Engineer',
        skills: [],
        rank: 'Elite Member',
        company: 'ThinkGrid',
        points: 2840,
        streak: 0,
        verified: false,
        name: ''
    });
    const [tempProfile, setTempProfile] = useState({ ...profile });

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const data = await getProfile();
                setProfile({
                    ...data,
                    skill: data.skills?.[0] || 'Learning'
                });
                setTempProfile({
                    ...data,
                    skill: data.skills?.[0] || 'Learning'
                });
            } catch (err) {
                console.error('Error fetching home profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handleEditProfile = () => {
        setTempProfile({ ...profile });
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async () => {
        try {
            const updated = await updateProfile({
                ...tempProfile,
                skills: tempProfile.skill ? [tempProfile.skill] : profile.skills
            });
            setProfile({
                ...updated,
                skill: updated.skills?.[0] || 'Learning'
            });
            setIsEditingProfile(false);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile updates.');
        }
    };

    const handleCancelProfile = () => {
        setIsEditingProfile(false);
    };

    if (loading) return <div className="loading-state">Syncing Elite Status...</div>;

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
                    <div className="points-amount">{profile.points?.toLocaleString() || 0} <span className="points-unit">pts</span></div>
                    <div className="points-stats">
                        <span className="stat-up">↗ +0 earned</span>
                        <span className="stat-down">↘ −0 spent</span>
                    </div>
                </div>

                {/* Profile Info Card */}
                <div className="dash-card info-card">
                    <div className="card-label-row">
                        <span className="card-label">My Profile</span>
                        {!isEditingProfile ? (
                            <button className="icon-action-btn" onClick={handleEditProfile}>✏️</button>
                        ) : (
                            <div className="profile-actions">
                                <button className="btn-profile-save" onClick={handleSaveProfile}>Save</button>
                                <button className="btn-profile-cancel" onClick={handleCancelProfile}>Cancel</button>
                            </div>
                        )}
                    </div>
                    <div className="info-rows">
                        <div className="info-row">
                            <Briefcase size={14} className="info-icon" />
                            <span className="info-key">Role</span>
                            {isEditingProfile ? (
                                <input
                                    className="profile-input"
                                    value={tempProfile.role}
                                    onChange={e => setTempProfile({ ...tempProfile, role: e.target.value })}
                                />
                            ) : (
                                <span className="info-val">{profile.role || 'Elite Member'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <Award size={14} className="info-icon" />
                            <span className="info-key">Top Skill</span>
                            {isEditingProfile ? (
                                <input
                                    className="profile-input"
                                    value={tempProfile.skill}
                                    onChange={e => setTempProfile({ ...tempProfile, skill: e.target.value })}
                                />
                            ) : (
                                <span className="info-val">{profile.skill}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <Users size={14} className="info-icon" />
                            <span className="info-key">Rank</span>
                            <span className="info-val">{profile.rank || 'Member'}</span>
                        </div>
                        <div className="info-row">
                            <Building2 size={14} className="info-icon" />
                            <span className="info-key">Company</span>
                            {isEditingProfile ? (
                                <input
                                    className="profile-input"
                                    value={tempProfile.company}
                                    onChange={e => setTempProfile({ ...tempProfile, company: e.target.value })}
                                />
                            ) : (
                                <span className="info-val">{profile.company || 'ThinkGrid'}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Status Card */}
                <div className="dash-card status-card">
                    <div className="card-label-row">
                        <span className="card-label">Elite Performance</span>
                        <span className="three-dots">···</span>
                    </div>
                    <div className="status-row">
                        <div className="status-icon verified" style={{ color: '#F59E0B', background: '#FFF7ED' }}>
                            <Award size={14} />
                        </div>
                        <span className="status-text">Contribution Rank</span>
                        <button className="btn-status-action" style={{ background: '#F59E0B' }}>Tier 4</button>
                    </div>
                    <div className="status-row">
                        <div className="status-icon verified" style={{ color: '#10B981', background: '#ECFDF5' }}>
                            <TrendingUp size={14} />
                        </div>
                        <span className="status-text">Connect Reputation</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>98% Pos</span>
                    </div>
                    <div className="status-row">
                        <div className="status-icon verified" style={{ color: '#7F00FF', background: '#F5F3FF' }}>
                            <BookOpen size={14} />
                        </div>
                        <span className="status-text">Materials Impact</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7F00FF' }}>Expert</span>
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
                                <span className="mc-logo-dot" />
                                <span>THINKGRID ELITE</span>
                            </div>
                            <div className="mc-chips">
                                <div className="mc-stat-item">
                                    <span className="mc-stat-val">0</span>
                                    <span className="mc-stat-label">Contributions</span>
                                </div>
                                <div className="mc-stat-item">
                                    <span className="mc-stat-val">{profile.following || 0}</span>
                                    <span className="mc-stat-label">Network</span>
                                </div>
                                <div className="mc-stat-item">
                                    <span className="mc-stat-val">0</span>
                                    <span className="mc-stat-label">Mentorships</span>
                                </div>
                            </div>
                            <div className="mc-points">{profile.points?.toLocaleString() || 0} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PTS</span></div>
                            <div className="mc-footer">
                                <div className="mc-user">
                                    <span className="mc-name">{profile.name}</span>
                                </div>
                                <span className="mc-since">Member since {new Date(profile.createdAt).getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collaboration Panel */}
                <div className="dash-card collab-card">
                    <div className="card-label-row">
                        <span className="card-label">Start Collaboration</span>
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
