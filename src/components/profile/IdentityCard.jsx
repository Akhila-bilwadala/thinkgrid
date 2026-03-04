import React from 'react';
import { Award, BookOpen, GraduationCap, Zap } from 'lucide-react';
import './IdentityCard.css';

const IdentityCard = ({ user }) => {
    const progress = (user.contributionScore % 1000) / 10;

    return (
        <div className="id-card-v2 glass">
            <div className="id-card-glow" />

            <div className="id-card-header">
                <div className="user-profile-summary">
                    <div className="id-avatar">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="id-user-meta">
                        <h3 className="id-name">{user.name}</h3>
                        <div className="id-tags">
                            <span className="id-label-tag"><GraduationCap size={12} /> {user.role}</span>
                            <span className="id-inst-tag">{user.institution}</span>
                        </div>
                    </div>
                </div>
                <div className="id-score-badge">
                    <Zap size={14} className="icon-gold" />
                    <span>{user.contributionScore}</span>
                </div>
            </div>

            <div className="id-card-content">
                <div className="id-section">
                    <div className="id-section-title">
                        <Award size={14} className="icon-blue" />
                        <span>Mastering</span>
                    </div>
                    <div className="id-skills-grid">
                        {user.skillsKnow.map((skill, index) => (
                            <div key={index} className="id-skill-item">
                                <span className="skill-name">{skill.name}</span>
                                <span className={`skill-level ${skill.level.toLowerCase()}`}>{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="id-section">
                    <div className="id-section-title">
                        <BookOpen size={14} className="icon-purple" />
                        <span>Learning Goals</span>
                    </div>
                    <div className="id-goals-list">
                        {user.skillsWant.map((goal, index) => (
                            <span key={index} className="id-goal-tag">{goal}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="id-card-footer">
                <div className="id-progress-container">
                    <div className="progress-info">
                        <span className="level-label">Level {Math.floor(user.contributionScore / 1000) + 1}</span>
                        <span className="xp-label">{user.contributionScore % 1000}/1000 XP</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentityCard;
