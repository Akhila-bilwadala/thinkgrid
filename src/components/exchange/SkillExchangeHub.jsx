import React, { useState } from 'react';
import SkillExchangeCard from './SkillExchangeCard';
import { Search, Filter, ArrowUpRight, Zap, Target } from 'lucide-react';
import './SkillExchangeHub.css';

const MOCK_EXCHANGES = [
    {
        id: 1,
        sender: { name: 'Jordan Lee', institution: 'MIT', year: 'Junior', rating: 4.9 },
        skillOffered: 'FastAPI / Python',
        skillWanted: 'Three.js / WebGL',
        schedule: 'Weekends, 2h/day',
        mode: 'Video Call'
    },
    {
        id: 2,
        sender: { name: 'Priya Sharma', institution: 'BITS Pilani', year: 'Senior', rating: 4.8 },
        skillOffered: 'Market Analysis',
        skillWanted: 'SQL Mastery',
        schedule: 'Weekday evenings',
        mode: 'Hybrid (Chat + Notes)'
    }
];

const SkillExchangeHub = () => {
    const [activeTab, setActiveTab] = useState('marketplace');

    return (
        <div className="exchange-hub-v2 animate-fade">
            <header className="hub-header">
                <div className="hub-title-section">
                    <h2 className="gradient-text">Skill Swap Hub</h2>
                    <p>Connect with peers to trade knowledge. Zero cost, pure growth.</p>
                </div>
                <div className="hub-stats glass">
                    <div className="stat-unit">
                        <span className="stat-value">14</span>
                        <span className="stat-label">Active Swaps</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-unit">
                        <span className="stat-value">2.4k</span>
                        <span className="stat-label">Skill Matches</span>
                    </div>
                </div>
            </header>

            <div className="hub-controls">
                <div className="hub-tabs">
                    <button className={`hub-tab ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>Marketplace</button>
                    <button className={`hub-tab ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>My Requests <span className="badge">3</span></button>
                    <button className={`hub-tab ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>Active Sessions</button>
                </div>
                <div className="search-box-mini glass">
                    <Search size={16} />
                    <input type="text" placeholder="Search skills or users..." />
                </div>
            </div>

            <div className="hub-content">
                <section className="featured-section">
                    <div className="section-intro">
                        <div className="intro-icon"><Zap size={18} /></div>
                        <h3>Recommended Pairings</h3>
                    </div>
                    <div className="exchange-grid">
                        {MOCK_EXCHANGES.map(req => (
                            <SkillExchangeCard key={req.id} request={req} />
                        ))}
                    </div>
                </section>

                <section className="skill-discovery">
                    <div className="section-intro">
                        <div className="intro-icon"><Target size={18} /></div>
                        <h3>Top Skills in Demand</h3>
                    </div>
                    <div className="discovery-cards">
                        {['Large Language Models', 'Cybersecurity', 'Financial Modeling', 'UX Research'].map((skill, i) => (
                            <div key={i} className="skill-tile premium-card">
                                <span className="tile-name">{skill}</span>
                                <span className="tile-count">12 mentors available</span>
                                <ArrowUpRight size={14} className="tile-arrow" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SkillExchangeHub;
