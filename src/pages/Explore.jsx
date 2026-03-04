import React, { useState } from 'react';
import { Search, MoreVertical, Github, Linkedin } from 'lucide-react';
import './Explore.css';

const CONTRIBUTORS = [
    {
        id: 1, name: 'Dr. Sarah Venn', email: 'sarah.venn@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=1', progress: 100,
        role: 'SQL & DBMS Specialist', category: 'Professor'
    },
    {
        id: 2, name: 'Ravi Kumar', email: 'ravi.k@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=3', progress: 82,
        role: 'Python Mentor', category: 'Mentor'
    },
    {
        id: 3, name: 'Sneha Reddy', email: 'sneha.r@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=5', progress: 66,
        role: 'ML Researcher', category: 'Senior'
    },
    {
        id: 4, name: 'Arjun Singh', email: 'arjun.s@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=8', progress: 45,
        role: 'Backend Engineer', category: 'Student'
    },
    {
        id: 5, name: "Kevin D'Souza", email: 'kevin.d@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=11', progress: 91,
        role: 'DSA Mentor', category: 'Mentor'
    },
    {
        id: 6, name: 'Priya Sharma', email: 'priya.s@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=9', progress: 58,
        role: 'UX/UI Designer', category: 'Senior'
    },
    {
        id: 7, name: 'James Wilson', email: 'james.w@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=12', progress: 74,
        role: 'OS Specialist', category: 'Professor'
    },
    {
        id: 8, name: 'Ananya Iyer', email: 'ananya.i@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=20', progress: 37,
        role: 'Cloud Architect', category: 'Student'
    },
    {
        id: 9, name: 'Deepak Nair', email: 'deepak.n@thinkgrid.com',
        avatar: 'https://i.pravatar.cc/120?img=15', progress: 100,
        role: 'DevOps Engineer', category: 'Mentor'
    }
];

export default function Explore() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = CONTRIBUTORS.filter(u =>
        (category === 'All' || u.category === category) &&
        (u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="mhub-container">
            {/* Toolbar */}
            <div className="mhub-toolbar">
                <div className="mhub-search">
                    <Search size={18} className="mhub-search-icon" />
                    <input
                        placeholder="Search contributors, mentors..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <div className="mhub-pills">
                    {['All', 'Mentor', 'Professor', 'Senior', 'Student'].map(c => (
                        <button
                            key={c}
                            className={`mhub-pill ${category === c ? 'active' : ''}`}
                            onClick={() => setCategory(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="mhub-grid">
                {filtered.map(u => (
                    <div key={u.id} className="mhub-card">
                        {/* Three-dot menu */}
                        <button className="mhub-card-menu">
                            <MoreVertical size={18} />
                        </button>

                        {/* Avatar */}
                        <div className="mhub-avatar-wrap">
                            <img src={u.avatar} alt={u.name} className="mhub-avatar" />
                        </div>

                        {/* Name & Role */}
                        <h3 className="mhub-name">{u.name}</h3>
                        <p className="mhub-role-mid">{u.role}</p>

                        {/* Social Links */}
                        <div className="mhub-socials">
                            <a href="#" className="mhub-social-icon"><Github size={20} /></a>
                            <a href="#" className="mhub-social-icon"><Linkedin size={20} /></a>
                        </div>

                        {/* Divider */}
                        <div className="mhub-card-divider" />

                        {/* Action Buttons */}
                        <div className="mhub-actions">
                            <button className="mhub-btn-connect">Connect</button>
                            <button className="mhub-btn-exchange">Exchange</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
