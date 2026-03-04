import React, { useState } from 'react';
import {
    CheckCircle2,
    MapPin,
    Calendar,
    ExternalLink,
    MoreHorizontal,
    Share2,
    Star,
    Award,
    UserPlus
} from 'lucide-react';
import './Profile.css';

const TOP_SKILLS = ['React Native', 'UI/UX Design', 'System Architecture', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure'];

const REVIEWS = [
    { id: 1, user: 'Gleb', initial: 'GM', time: '1 month ago', text: 'Alex possesses two qualities that set them apart from other mentors: patience and deep technical clarity...' },
    { id: 2, user: 'Victoria', initial: 'V', time: '2 months ago', text: 'Their keen eye for detail, creativity, and dedication to our project were evident from the start.' },
    { id: 3, user: 'Anna Dmitrieva', initial: 'AD', time: '3 months ago', text: 'Highly recommended for anyone looking to master complex backend systems.' },
];

const EXPERIENCE = [
    { id: 1, company: 'Orbit Tech', role: 'Senior Mentor', type: 'Remote', duration: '6 months', desc: 'Leading the backend architecture for high-traffic real-time streaming platforms.' },
    { id: 2, company: 'SkillChain', role: 'Fullstack Dev', type: 'Hybrid', duration: '1.5 years', desc: 'Built decentralized learning protocols using Ethereum and React.' },
];

export default function Profile() {

    return (
        <div className="profile-redesign animate-up">
            <div className="profile-layout-grid">

                {/* Main Column */}
                <div className="profile-main-col">

                    {/* Centered Header Card */}
                    <div className="profile-header-card card">
                        <div className="profile-cover">
                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop" alt="cover" />
                            <div className="cover-actions">
                                <button className="cover-btn"><Share2 size={16} /></button>
                                <button className="cover-btn"><MoreHorizontal size={16} /></button>
                            </div>
                        </div>

                        <div className="profile-header-content">
                            <div className="profile-avatar-centered">
                                <img src="/bogdan.png" alt="Alex Smith" />
                                <div className="status-badge" />
                            </div>

                            <div className="profile-identity">
                                <div className="profile-handle">@alex.dev</div>
                                <h1 className="profile-name">
                                    Alex Smith <CheckCircle2 size={20} className="verified-icon" />
                                </h1>
                                <p className="profile-headline">Senior Software Architect, 6+ years of experience</p>

                                <div className="profile-meta-row">
                                    <span className="meta-item"><MapPin size={14} /> Yerevan, Armenia</span>
                                    <span className="meta-divider">|</span>
                                    <span className="meta-item"><Calendar size={14} /> Joined March 2022</span>
                                </div>

                                <div className="profile-header-actions">
                                    <button className="btn-subscribe">
                                        <UserPlus size={18} />
                                        <span>Collaborate</span>
                                    </button>
                                    <button className="btn-edit-secondary">Edit profile</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="profile-sections-stack">
                        {/* Experience Section */}
                        <div className="content-section card">
                            <h2 className="section-title">Experience</h2>
                            <div className="experience-list">
                                {EXPERIENCE.map(exp => (
                                    <div key={exp.id} className="experience-item">
                                        <div className="exp-dot" />
                                        <div className="exp-content">
                                            <div className="exp-header">
                                                <h3 className="exp-company">{exp.company} <span className="exp-type">{exp.type}</span></h3>
                                                <span className="exp-duration">{exp.duration}</span>
                                            </div>
                                            <div className="exp-role">{exp.role}</div>
                                            <p className="exp-desc">{exp.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="content-section card">
                            <h2 className="section-title">Achievements</h2>
                            <div className="achieve-grid">
                                <div className="achieve-item">
                                    <Award className="ach-icon" />
                                    <span>Top 1% DBMS Mentor</span>
                                </div>
                                <div className="achieve-item">
                                    <Star className="ach-icon" />
                                    <span>500+ Skills Shared</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="profile-side-col">

                    {/* Top Skills Card */}
                    <div className="side-card card">
                        <div className="card-head">
                            <h2 className="side-card-title">Top Skills</h2>
                        </div>
                        <div className="skills-pill-cloud">
                            {TOP_SKILLS.map(skill => (
                                <span key={skill} className="skill-pill-item">{skill}</span>
                            ))}
                            <button className="btn-view-more">Show all skills</button>
                        </div>
                    </div>

                    {/* Reviews Card */}
                    <div className="side-card card reviews-card">
                        <div className="reviews-tabs">
                            <h2 className="side-card-title" style={{ marginBottom: 0 }}>Reviews</h2>
                        </div>

                        <div className="reviews-list">
                            {REVIEWS.map(rev => (
                                <div key={rev.id} className="review-item">
                                    <div className="rev-user-row">
                                        <div className="rev-avatar">{rev.initial}</div>
                                        <div className="rev-user-info">
                                            <div className="rev-name">{rev.user}</div>
                                            <div className="rev-time">{rev.time}</div>
                                        </div>
                                    </div>
                                    <p className="rev-text">{rev.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
