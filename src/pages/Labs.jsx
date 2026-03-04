import React, { useState } from 'react';
import { Search, Plus, Users, Star, GitMerge, Code2, Globe, Database, ChevronRight } from 'lucide-react';
import './Labs.css';

const LABS_DATA = [
    {
        id: 1,
        title: 'OpenSource LearnHub',
        host: 'Ravi Kumar',
        avatar: 'https://i.pravatar.cc/120?img=3',
        description: 'Building a community-driven platform for indexing free coding resources and roadmaps.',
        tags: ['React', 'Node.js', 'MongoDB'],
        status: 'OPEN',
        members: 4,
        maxMembers: 10,
        stars: 128,
        icon: <Globe size={24} />
    },
    {
        id: 2,
        title: 'CryptoTracker API',
        host: 'Sneha Reddy',
        avatar: 'https://i.pravatar.cc/120?img=5',
        description: 'A low-latency GraphQL API wrapper for aggregating real-time crypto prices across exchanges.',
        tags: ['GraphQL', 'Go', 'Redis'],
        status: 'CLOSED',
        members: 3,
        maxMembers: 3,
        stars: 45,
        icon: <Database size={24} />
    },
    {
        id: 3,
        title: 'ThinkGrid Mobile App',
        host: 'Priya Sharma',
        avatar: 'https://i.pravatar.cc/120?img=9',
        description: 'Developing the official React Native companion app for ThinkGrid with offline support.',
        tags: ['React Native', 'Firebase'],
        status: 'OPEN',
        members: 2,
        maxMembers: 5,
        stars: 89,
        icon: <Code2 size={24} />
    },
    {
        id: 4,
        title: 'ML Crop Predictor',
        host: 'Dr. Sarah Venn',
        avatar: 'https://i.pravatar.cc/120?img=1',
        description: 'Machine learning model to predict crop yields based on soil and weather data.',
        tags: ['Python', 'TensorFlow', 'Pandas'],
        status: 'OPEN',
        members: 6,
        maxMembers: 8,
        stars: 210,
        icon: <GitMerge size={24} />
    }
];

export default function Labs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, OPEN, CLOSED

    const filteredLabs = LABS_DATA.filter(lab => {
        const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lab.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'ALL' ? true : lab.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="labs-container">
            {/* Header */}
            <div className="labs-header">
                <div className="labs-header-content">
                    <h1>Active Labs</h1>
                    <p>Join live projects hosted by peers, contribute code, and build your portfolio.</p>
                </div>
                <button className="labs-create-btn">
                    <Plus size={18} />
                    Host Project
                </button>
            </div>

            {/* Toolbar */}
            <div className="labs-toolbar">
                <div className="labs-search">
                    <Search size={18} />
                    <input
                        placeholder="Search projects by name or tools..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="labs-filters">
                    {['ALL', 'OPEN', 'CLOSED'].map(f => (
                        <button
                            key={f}
                            className={`labs-filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'ALL' ? 'All Projects' : f === 'OPEN' ? 'Accepting Contributors' : 'Team Full'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="labs-grid">
                {filteredLabs.map(lab => (
                    <div key={lab.id} className="lab-card">
                        <div className="lab-card-header">
                            <div className="lab-icon-box">{lab.icon}</div>
                            <div className={`lab-status ${lab.status.toLowerCase()}`}>
                                {lab.status === 'OPEN' ? '● Open to Join' : 'Closed'}
                            </div>
                        </div>

                        <div className="lab-card-body">
                            <h3 className="lab-title">{lab.title}</h3>
                            <p className="lab-desc">{lab.description}</p>

                            <div className="lab-tags">
                                {lab.tags.map(tag => (
                                    <span key={tag} className="lab-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="lab-card-footer">
                            <div className="lab-host-info">
                                <img src={lab.avatar} alt={lab.host} className="lab-host-avatar" />
                                <div>
                                    <span className="lab-hosted-by">Hosted by</span>
                                    <span className="lab-host-name">{lab.host}</span>
                                </div>
                            </div>

                            <div className="lab-metrics">
                                <div className="lab-metric" title="Contributors">
                                    <Users size={14} />
                                    <span>{lab.members}/{lab.maxMembers}</span>
                                </div>
                                <div className="lab-metric" title="Stars">
                                    <Star size={14} />
                                    <span>{lab.stars}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className={`lab-join-btn ${lab.status.toLowerCase()}`} disabled={lab.status === 'CLOSED'}>
                            {lab.status === 'OPEN' ? 'Join Project' : 'View Repository'}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
