import React from 'react';
import {
    Award,
    BookOpen,
    MapPin,
    Calendar,
    Edit3,
    Share2,
    Github,
    Twitter,
    Linkedin,
    CheckCircle,
    TrendingUp,
    History
} from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = ({ user }) => {
    return (
        <div className="profile-page-v2 animate-fade">
            <header className="profile-hero premium-card">
                <div className="hero-glow" />
                <div className="profile-cover"></div>
                <div className="profile-main-info">
                    <div className="profile-avatar-large">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="profile-text-info">
                        <div className="name-row">
                            <h2>{user.name}</h2>
                            <CheckCircle size={20} className="verified-icon" />
                            <button className="edit-profile-btn glass">
                                <Edit3 size={16} />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                        <p className="profile-bio">Full-stack enthusiast passionate about AI and System Design. Learning to build the future of education.</p>
                        <div className="profile-badges-row">
                            <span className="profile-info-item"><MapPin size={14} /> {user.institution}</span>
                            <span className="profile-info-item"><Calendar size={14} /> Joined Jan 2026</span>
                            <span className="profile-info-item"><TrendingUp size={14} /> Top 1% in DBMS</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="profile-grid">
                <div className="profile-left-col">
                    <section className="profile-section-v2 glass">
                        <div className="section-header-v2">
                            <History size={18} className="icon-blue" />
                            <h3>Contribution</h3>
                        </div>
                        <div className="contribution-stats-v2">
                            <div className="c-stat">
                                <span className="c-val">{user.contributionScore}</span>
                                <span className="c-lab">Total XP</span>
                            </div>
                            <div className="c-stat">
                                <span className="c-val">42</span>
                                <span className="c-lab">Questions</span>
                            </div>
                            <div className="c-stat">
                                <span className="c-val">12</span>
                                <span className="c-lab">Swaps</span>
                            </div>
                        </div>
                        <div className="activity-heatmap">
                            {/* Simple visualization of activity */}
                            <div className="heatmap-header">Activity Intensity</div>
                            <div className="heatmap-grid">
                                {[...Array(35)].map((_, i) => (
                                    <div key={i} className={`heatmap-cell intensity-${Math.floor(Math.random() * 4)}`}></div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="profile-section-v2 glass">
                        <div className="section-header-v2">
                            <Share2 size={18} className="icon-purple" />
                            <h3>Social Links</h3>
                        </div>
                        <div className="social-links-v2">
                            <div className="social-item"><Github size={16} /> github.com/alexsmith</div>
                            <div className="social-item"><Linkedin size={16} /> linkedin.com/in/alexsmith</div>
                            <div className="social-item"><Twitter size={16} /> @alex_codes</div>
                        </div>
                    </section>
                </div>

                <div className="profile-main-col">
                    <section className="profile-section-v2 glass">
                        <div className="section-header-v2">
                            <Award size={18} className="icon-gold" />
                            <h3>Skill Proficiency</h3>
                        </div>
                        <div className="proficiency-list">
                            {user.skillsKnow.map((skill, idx) => (
                                <div key={idx} className="proficiency-item">
                                    <div className="p-info">
                                        <span className="p-name">{skill.name}</span>
                                        <span className="p-percent">85%</span>
                                    </div>
                                    <div className="p-bar-bg">
                                        <div className="p-bar-fill" style={{ width: '85%', background: idx % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-purple)' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="profile-section-v2 glass">
                        <div className="section-header-v2">
                            <BookOpen size={18} className="icon-blue" />
                            <h3>Certifications</h3>
                        </div>
                        <div className="certs-list">
                            <div className="cert-item premium-card">
                                <div className="cert-icon">🏆</div>
                                <div className="cert-info">
                                    <span className="cert-title">Google Cloud Engineer</span>
                                    <span className="cert-issuer">Google Cloud • 2026</span>
                                </div>
                            </div>
                            <div className="cert-item premium-card">
                                <div className="cert-icon">🎓</div>
                                <div className="cert-info">
                                    <span className="cert-title">React Advanced Patterns</span>
                                    <span className="cert-issuer">Frontend Masters • 2025</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
