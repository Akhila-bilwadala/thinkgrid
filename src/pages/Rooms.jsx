import React, { useState } from 'react';
import {
    Users,
    MessageSquare,
    Plus,
    Flame,
    Hash,
    CheckCircle2,
    ChevronRight,
    Search
} from 'lucide-react';
import './Rooms.css';

const ROOMS = [
    {
        id: 1,
        name: 'Placement Prep 2026',
        description: 'Mock interviews, resume reviews, and daily DSA challenges.',
        members: 1240,
        posts: 89,
        tags: ['DSA', 'SDE', 'HR'],
        joined: true,
        hot: true,
        gradient: 'linear-gradient(135deg, #FF3E6C 0%, #FFD080 100%)'
    },
    {
        id: 2,
        name: 'DSA Beginners',
        description: 'Start your journey with basic pointers, arrays and recursion.',
        members: 850,
        posts: 124,
        tags: ['Arrays', 'Logic'],
        joined: true,
        hot: true,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
        id: 3,
        name: 'GATE CSE Masterclass',
        description: 'Focusing on Theory of Computation and OS concepts.',
        members: 420,
        posts: 45,
        tags: ['GATE', 'Theory'],
        joined: false,
        hot: false,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 4,
        name: 'ML & AI Discussion',
        description: 'Papers, neural networks, and PyTorch workshops.',
        members: 2100,
        posts: 312,
        tags: ['ML', 'Research'],
        joined: false,
        hot: true,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        id: 5,
        name: 'Web Dev Hangout',
        description: 'Building fullstack apps with Next.js and Tailwind.',
        members: 1670,
        posts: 156,
        tags: ['React', 'Node'],
        joined: false,
        hot: false,
        gradient: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)'
    },
    {
        id: 6,
        name: 'System Design Club',
        description: 'Scaling architectures, load balancing, and DB sharding.',
        members: 890,
        posts: 78,
        tags: ['Scalability', 'DB'],
        joined: false,
        hot: true,
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    }
];

export default function Rooms() {
    const [tab, setTab] = useState('all');
    const [joinedRooms, setJoinedRooms] = useState(() =>
        new Set(ROOMS.filter(r => r.joined).map(r => r.id))
    );
    const [searchQuery, setSearchQuery] = useState('');

    const toggleJoin = (id) => {
        setJoinedRooms(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const displayed = ROOMS.filter(r => {
        const matchesTab = tab === 'all' ? true : tab === 'joined' ? joinedRooms.has(r.id) : r.hot;
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="rooms-container">
            {/* Immersive Header */}
            <div className="rooms-header-glass">
                <div className="header-content">
                    <h1 className="header-title">Discussion Rooms</h1>
                    <p className="header-subtitle">Join topic-based communities to collaborate and grow together.</p>
                </div>
                <button className="create-room-btn">
                    <Plus size={20} />
                    <span>Create New Room</span>
                </button>
            </div>

            {/* Navigation & Filters */}
            <div className="rooms-toolbar">
                <div className="rooms-tabs-glass">
                    <button
                        className={`rooms-tab ${tab === 'all' ? 'active' : ''}`}
                        onClick={() => setTab('all')}
                    >
                        All Communities
                    </button>
                    <button
                        className={`rooms-tab ${tab === 'joined' ? 'active' : ''}`}
                        onClick={() => setTab('joined')}
                    >
                        My Rooms ({joinedRooms.size})
                    </button>
                    <button
                        className={`rooms-tab ${tab === 'hot' ? 'active' : ''}`}
                        onClick={() => setTab('hot')}
                    >
                        <Flame size={16} />
                        <span>Trending</span>
                    </button>
                </div>

                <div className="rooms-search-wrapper">
                    <Search size={18} />
                    <input
                        placeholder="Search for rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Rooms Grid */}
            <div className="rooms-grid">
                {displayed.map(r => (
                    <div key={r.id} className="room-card-glass">
                        <div className="room-card-inner">
                            <div className="room-header">
                                <div className="room-icon-box" style={{ background: r.gradient }}>
                                    <Hash size={24} color="white" />
                                </div>
                                {r.hot && <div className="hot-tag"><Flame size={12} /> HOT</div>}
                            </div>

                            <div className="room-body">
                                <h3 className="room-name">{r.name}</h3>
                                <p className="room-desc">{r.description}</p>

                                <div className="room-tags">
                                    {r.tags.map(tag => (
                                        <span key={tag} className="room-tag-pill">#{tag}</span>
                                    ))}
                                </div>

                                <div className="room-stats-row">
                                    <div className="room-stat">
                                        <Users size={14} />
                                        <span>{r.members.toLocaleString()}</span>
                                    </div>
                                    <div className="room-stat">
                                        <MessageSquare size={14} />
                                        <span>{r.posts} posts today</span>
                                    </div>
                                </div>
                            </div>

                            <div className="room-footer">
                                <button
                                    className={`join-btn ${joinedRooms.has(r.id) ? 'joined' : ''}`}
                                    onClick={() => toggleJoin(r.id)}
                                >
                                    {joinedRooms.has(r.id) ? (
                                        <>
                                            <CheckCircle2 size={16} />
                                            <span>Member</span>
                                        </>
                                    ) : (
                                        <span>Join Room</span>
                                    )}
                                </button>
                                <button className="enter-room-btn" title="Enter Community">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
