import React, { useState } from 'react';
import './Home.css';


const TRENDING_TOPICS = [
    { id: 1, name: 'AI & Machine Learning', icon: '🤖', growth: '+12%', learners: '4.2k active', color: '#FF3E6C' },
    { id: 2, name: 'Fullstack Development', icon: '💻', growth: '+8%', learners: '3.1k active', color: '#4facfe' },
    { id: 3, name: 'Data Structures & Algos', icon: '🧠', growth: '+15%', learners: '5.6k active', color: '#FACC15' },
    { id: 4, name: 'Cloud Architecture', icon: '☁️', growth: '+5%', learners: '1.2k active', color: '#4ade80' },
];

const PROJECT_SHOWCASE = [
    {
        id: 1,
        title: 'Neural Network Visualization Lab',
        category: 'Research',
        contributors: 12,
        active: true,
        preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
        tags: ['AI', 'Python', 'WebGPU']
    },
    {
        id: 2,
        title: 'Distributed Systems Study Guide',
        category: 'Document',
        contributors: 45,
        active: false,
        preview: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
        tags: ['Architecture', 'Notes']
    },
    {
        id: 3,
        title: 'Open-Source UI Library',
        category: 'Development',
        contributors: 8,
        active: true,
        preview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        tags: ['React', 'CSS', 'Glassmorphism']
    },
    {
        id: 4,
        title: 'Quantum Computing Fundamentals',
        category: 'Lab',
        contributors: 5,
        active: true,
        preview: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
        tags: ['Physics', 'Qiskit']
    },
];

export default function Home() {
    const [activeTab, setActiveTab] = useState('Active Labs');

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="home-hero-grid">
                <div className="feature-card card">
                    <div className="feature-tag">#TRENDING</div>
                    <div className="feature-content">
                        <h1 className="feature-title">Optimize your skills anywhere anytime</h1>
                        <p className="feature-sub">Learn from top industry mentors on ThinkGrid and accelerate your tech career.</p>
                        <button className="btn-feature">Watch Now</button>
                    </div>
                    <div className="feature-image">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=600&fit=crop" alt="Learning" />
                    </div>
                </div>

                <div className="trending-topics-panel card">
                    <div className="panel-head">
                        <h3 className="panel-title">Trending Topics</h3>
                        <span className="view-all">Explore</span>
                    </div>
                    <div className="topics-list">
                        {TRENDING_TOPICS.map(topic => (
                            <div key={topic.id} className="topic-row">
                                <div className="topic-icon-box" style={{ background: `${topic.color}15`, color: topic.color }}>
                                    {topic.icon}
                                </div>
                                <div className="topic-info">
                                    <div className="topic-name">#{topic.name.replace(/\s+/g, '_')}</div>
                                    <div className="topic-meta">
                                        <span className="topic-learners">{topic.learners}</span>
                                        <span className="topic-growth" style={{ color: topic.color }}>{topic.growth}</span>
                                    </div>
                                </div>
                                <div className="topic-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Showcase Sections */}
            <div className="trending-header">
                <div className="section-labels">
                    <span className="label-prefix">COLLABORATE</span>
                    <h2 className="section-main-title">#ActiveProjectLabs</h2>
                </div>
                <div className="section-actions">
                    <span className="action-view">View All Labs</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-bar">
                <div className="tabs">
                    {['Active Labs'].map(t => (
                        <button
                            key={t}
                            className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <button className="btn-filter">
                    <span>Filter</span>
                </button>
            </div>

            {/* Showcase Grid */}
            <div className="showcase-grid">
                {PROJECT_SHOWCASE.map(project => (
                    <div key={project.id} className="showcase-card">
                        <div className="showcase-thumb">
                            <img src={project.preview} alt={project.title} />
                            {project.active && <div className="active-lab-badge">Live Lab</div>}
                            <div className="contributors-pill">👥 {project.contributors} Collaborators</div>
                        </div>
                        <div className="showcase-meta">
                            <div className="showcase-type">{project.category}</div>
                            <h4 className="showcase-title">{project.title}</h4>
                            <p className="showcase-desc">Collaborate on research, share live documents, and build together in real-time.</p>
                            <div className="showcase-tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="project-tag">{tag}</span>
                                ))}
                            </div>
                            <button className="btn-join-lab">Join Lab</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
