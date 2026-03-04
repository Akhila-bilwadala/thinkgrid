import React, { useState } from 'react';
import { Search, Plus, Image as ImageIcon } from 'lucide-react';
import './Rooms.css';

const ROOMS = [
    {
        id: 1,
        name: 'Placement Prep 2026',
        description: 'Mock interviews, resume reviews, and daily DSA challenges.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        joined: true
    },
    {
        id: 2,
        name: 'DSA Beginners',
        description: 'Start your journey with basic pointers, arrays and recursion.',
        image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
        joined: true
    },
    {
        id: 3,
        name: 'GATE CSE Masterclass',
        description: 'Focusing on Theory of Computation and OS concepts.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        joined: false
    },
    {
        id: 4,
        name: 'ML & AI Discussion',
        description: 'Papers, neural networks, and PyTorch workshops.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
        joined: false
    },
    {
        id: 5,
        name: 'Web Dev Hangout',
        description: 'Building fullstack apps with Next.js and Tailwind.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        joined: false
    },
    {
        id: 6,
        name: 'System Design Club',
        description: 'Scaling architectures, load balancing, and DB sharding.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        joined: false
    }
];

export default function Rooms({ currentTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [joinedRooms, setJoinedRooms] = useState(() =>
        new Set(ROOMS.filter(r => r.joined).map(r => r.id))
    );

    const toggleJoin = (id) => {
        setJoinedRooms(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const displayed = ROOMS.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = currentTab === 'my-rooms' ? joinedRooms.has(r.id) : true;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="rooms-container">
            {/* Header */}
            <div className="rooms-header-block">
                <div className="rooms-header-text">
                    <h1>{currentTab === 'my-rooms' ? 'My Rooms' : 'Skill Exchange / Rooms'}</h1>
                    <p>{currentTab === 'my-rooms' ? 'Communities you are currently participating in.' : 'Connect with peers to share knowledge and discuss topics.'}</p>
                </div>
                <div className="rooms-search-wrapper">
                    <Search size={18} />
                    <input
                        placeholder="Search rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Cards Grid */}
            <div className="rooms-wf-grid">
                {displayed.map(r => (
                    <div key={r.id} className="room-wf-card">
                        {/* Cover Image Placeholder */}
                        <div className="room-wf-cover">
                            <img src={r.image} alt={r.name} className="room-wf-image" />
                        </div>

                        {/* Content */}
                        <div className="room-wf-content">
                            <h3 className="room-wf-title">{r.name}</h3>
                            <p className="room-wf-desc">{r.description}</p>

                            <button
                                className={`room-wf-action ${joinedRooms.has(r.id) ? 'joined' : ''}`}
                                onClick={() => toggleJoin(r.id)}
                            >
                                {joinedRooms.has(r.id) ? 'Joined' : 'Join Room'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
