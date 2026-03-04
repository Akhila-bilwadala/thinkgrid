import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    MessageSquare,
    Repeat,
    MoreHorizontal,
    MonitorPlay,
    Users,
    X,
    Check
} from 'lucide-react';
import './Explore.css';

const USERS = [
    {
        id: 1,
        name: 'Dr. Sarah Venn',
        role: 'Professor | SQL & DBMS Specialist',
        inst: 'Anna University',
        headline: 'Professor of Computer Science | Helped 2000+ students master Databases | Open for Research Collaboration.',
        avatar: '👩‍🏫',
        banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        mutual: 15,
        followedBy: ['Ravi', 'Sneha'],
        category: 'Professor'
    },
    {
        id: 2,
        name: 'Ravi Kumar',
        role: 'Full Stack Developer | Python Expert',
        inst: 'VIT Vellore',
        headline: 'MERN Stack Enthusiast | Python Mentor @ ThinkGrid | Building scalable web apps with 3+ years experience.',
        avatar: '🧑‍💻',
        banner: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
        mutual: 24,
        followedBy: ['Arjun', 'Kevin'],
        category: 'Mentor'
    },
    {
        id: 3,
        name: 'Sneha Reddy',
        role: 'Data Scientist | Machine Learning',
        inst: 'BITS Pilani',
        headline: 'Data Scientist @ TechInd | ML Research Fellow | I teach SQL and Data Analysis for free.',
        avatar: '👩‍💻',
        banner: 'https://images.unsplash.com/photo-1551288049-bbda48658a7d?w=800&q=80',
        mutual: 8,
        followedBy: ['Sarah', 'Priya'],
        category: 'Senior'
    },
    {
        id: 4,
        name: 'Arjun Singh',
        role: 'Backend Engineer | Java & Spring',
        inst: 'NIT Trichy',
        headline: 'Java Expert | Spring Boot Developer | Open for collaborative projects in FinTech domain.',
        avatar: '🧑‍🎓',
        banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        mutual: 12,
        followedBy: ['Ravi', 'Sneha'],
        category: 'Student'
    },
    {
        id: 5,
        name: 'Kevin D\'Souza',
        role: 'Competitive Coder | DSA Mentor',
        inst: 'SRMIST',
        headline: '6-star Coder | DSA Mentor at SRMIST | Specialized in C++ and Advanced Data Structures.',
        avatar: '👨‍💻',
        banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        mutual: 31,
        followedBy: ['Arjun', 'Sneha'],
        category: 'Mentor'
    },
    {
        id: 6,
        name: 'Priya Sharma',
        role: 'UX/UI Designer | Creative Lead',
        inst: 'Amity University',
        headline: 'Product Designer | Design Mentor | Crafting premium experiences with user-centric design principles.',
        avatar: '👩‍🎓',
        banner: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
        mutual: 5,
        followedBy: ['Sarah', 'Sneha'],
        category: 'Senior'
    }
];

export default function Explore() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [followed, setFollowed] = useState({});

    const filtered = USERS.filter(u =>
        (category === 'All' || u.category === category) &&
        (u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="explore-container">
            {/* Header / Search Area */}
            <div className="explore-header-section">
                <div className="search-glass-wrapper">
                    <Search className="glass-search-icon" size={20} />
                    <input
                        className="glass-search-input"
                        placeholder="Search for mentors, experts by name or skill..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <div className="filter-scroll-row">
                    {['All', 'Mentor', 'Professor', 'Senior', 'Student'].map(c => (
                        <button
                            key={c}
                            className={`filter-glass-pill ${category === c ? 'active' : ''}`}
                            onClick={() => setCategory(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Area */}
            <div className="explore-grid">
                {filtered.map(u => (
                    <div key={u.id} className="explore-card-glass">
                        {/* Banner & Avatar overlap */}
                        <div className="card-top-section">
                            <img src={u.banner} alt="banner" className="card-banner-img" />
                            <div className="close-btn-glass"><X size={16} /></div>
                            <div className="card-avatar-overlap">{u.avatar}</div>
                        </div>

                        {/* Card Meta Info */}
                        <div className="card-content">
                            <div className="card-header-row">
                                <h3 className="card-user-name">{u.name}</h3>
                                <button
                                    className={`follow-glass-btn ${followed[u.id] ? 'active' : ''}`}
                                    onClick={() => setFollowed(p => ({ ...p, [u.id]: !p[u.id] }))}
                                >
                                    {followed[u.id] ? <><Check size={16} /> Following</> : 'Follow'}
                                </button>
                            </div>

                            <p className="card-user-role">{u.role}</p>
                            <p className="card-user-headline">{u.headline}</p>

                            {/* Mutual Connections / Social Proof */}
                            <div className="social-proof-row">
                                <div className="mutual-avatars">
                                    <div className="m-avatar" style={{ zIndex: 3 }}>👤</div>
                                    <div className="m-avatar" style={{ zIndex: 2, marginLeft: -10 }}>👤</div>
                                </div>
                                <span className="social-proof-text">
                                    {u.followedBy[0]}, {u.followedBy[1]} and {u.mutual} others you know followed
                                </span>
                            </div>

                            <div className="card-actions-row">
                                <button className="glass-action-btn"><MessageSquare size={16} /> Message</button>
                                <button className="glass-action-btn"><Repeat size={16} /> Exchange</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
