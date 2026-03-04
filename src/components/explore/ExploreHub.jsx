import React from 'react';
import { Search, Compass, Users, Book, Code, Globe, TrendingUp } from 'lucide-react';
import './ExploreHub.css';

const ExploreHub = () => {
    const categories = [
        { name: 'Computer Science', icon: <Code size={20} />, count: 1240 },
        { name: 'Mathematics', icon: <Globe size={20} />, count: 850 },
        { name: 'Physics', icon: <Compass size={20} />, count: 420 },
        { name: 'Economics', icon: <TrendingUp size={20} />, count: 610 },
    ];

    return (
        <div className="explore-hub animate-fade">
            <header className="explore-header">
                <h2 className="gradient-text">Discovery Engine</h2>
                <div className="explore-search glass">
                    <Search size={20} />
                    <input type="text" placeholder="Explore skills, mentors, or topics across all colleges..." />
                    <div className="search-hint">Press / to focus</div>
                </div>
            </header>

            <section className="explore-section">
                <div className="section-title-v2">
                    <h3>Browse Categories</h3>
                    <button className="text-link">View all</button>
                </div>
                <div className="category-grid">
                    {categories.map((cat, i) => (
                        <div key={i} className="category-card premium-card">
                            <div className="cat-icon">{cat.icon}</div>
                            <div className="cat-info">
                                <span className="cat-name">{cat.name}</span>
                                <span className="cat-meta">{cat.count} members</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="explore-section">
                <div className="section-title-v2">
                    <h3>Trending Discussions</h3>
                    <div className="filter-chips">
                        <span className="chip active">Global</span>
                        <span className="chip">My College</span>
                        <span className="chip">My Domain</span>
                    </div>
                </div>
                <div className="trending-topics-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="topic-card glass">
                            <div className="topic-header">
                                <div className="topic-tag">#Placement2026</div>
                                <Users size={14} className="topic-icon" />
                            </div>
                            <h4>Google Step Internship Preparation Phase 1</h4>
                            <p>Discussing technical rounds, behavioral questions, and previous year problems.</p>
                            <div className="topic-footer">
                                <span>12.4k participants</span>
                                <button className="join-btn-mini">Enter</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="explore-section">
                <div className="section-title-v2">
                    <h3>Rising Skill Partners</h3>
                </div>
                <div className="mentor-row">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="mentor-mini-card premium-card">
                            <div className="m-avatar">JD</div>
                            <span className="m-name">John Doe</span>
                            <span className="m-skill">System Design</span>
                            <button className="m-action">Request Swap</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ExploreHub;
