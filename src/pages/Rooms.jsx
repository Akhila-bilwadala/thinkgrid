import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, Users, X, MessageSquare, TrendingUp, Zap, Hexagon, Code, Palette, FlaskConical, Globe } from 'lucide-react';
import './Rooms.css';
import { getRooms, joinRoom, leaveRoom, createRoom } from '../api/rooms';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
    { id: 'All', label: 'All Rooms', icon: Globe },
    { id: 'Technology', label: 'Tech & Dev', icon: Code },
    { id: 'Design', label: 'Design', icon: Palette },
    { id: 'Science', label: 'Science', icon: FlaskConical },
    { id: 'General', label: 'General', icon: MessageSquare }
];

export default function Rooms({ currentTab, onEnterRoom }) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // New States
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular'); // 'popular', 'az', 'newest'
    
    // Modal variants
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getRooms();
                setRooms(data);
            } catch (err) {
                console.error('Error fetching rooms:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // ── Helper to mock categories based on keywords ──
    const getRoomCategory = (r) => {
        const text = (r.name + ' ' + r.description).toLowerCase();
        if (text.includes('dev') || text.includes('tech') || text.includes('code') || text.includes('software')) return 'Technology';
        if (text.includes('design') || text.includes('ui') || text.includes('art') || text.includes('ux')) return 'Design';
        if (text.includes('science') || text.includes('math') || text.includes('physics')) return 'Science';
        return 'General';
    };

    const toggleJoin = async (id) => {
        const room = rooms.find(r => r._id === id);
        const isJoined = room.members?.includes(user._id);

        try {
            if (isJoined) {
                await leaveRoom(id);
                setRooms(prev => prev.map(r => 
                    r._id === id ? { ...r, members: r.members.filter(m => m !== user._id) } : r
                ));
            } else {
                const updatedRoom = await joinRoom(id);
                setRooms(prev => prev.map(r => 
                    r._id === id ? updatedRoom : r
                ));
            }
        } catch (err) {
            console.error('Error toggling room join:', err);
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) return;
        try {
            await createRoom({ name: newRoomName, description: newRoomDesc });
            setNewRoomName('');
            setNewRoomDesc('');
            setShowCreateModal(false);
            const data = await getRooms();
            setRooms(data);
        } catch (err) {
            console.error('Failed to create room:', err);
            alert('Failed to create room');
        }
    };

    // ── Filtering and Sorting Logic ──
    const displayedRooms = useMemo(() => {
        let filtered = rooms.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            const isJoined = r.members?.includes(user._id);
            const matchesMyRooms = currentTab === 'my-rooms' ? isJoined : true;
            const matchesCat = activeCategory === 'All' ? true : getRoomCategory(r) === activeCategory;
            
            return matchesSearch && matchesMyRooms && matchesCat;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === 'popular') return (b.members?.length || 0) - (a.members?.length || 0);
            if (sortBy === 'az') return a.name.localeCompare(b.name);
            // 'newest' (assuming _id timestamp fallback if no createdAt)
            return b._id.localeCompare(a._id);
        });

        return filtered;
    }, [rooms, searchQuery, currentTab, activeCategory, sortBy, user._id]);

    const stats = {
        total: rooms.length,
        active: rooms.filter(r => r.members?.length > 2).length, // Mock active logic
        joined: rooms.filter(r => r.members?.includes(user._id)).length
    };

    if (loading) return (
        <div className="rooms-loading-state">
            <div className="elite-loader-wrap">
                <div className="elite-spinner"></div>
                <div className="elite-loader-text">Entering Thought Corridors...</div>
            </div>
        </div>
    );

    return (
        <div className="rooms-container animate-fade-in">

            {/* ── Control Bar (Sticky) ── */}
            <div className="rooms-control-bar">
                <div className="rooms-tabs">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id}
                            className={`room-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <cat.icon size={16} /> <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="rooms-controls-right">
                    <div className="rooms-search-box">
                        <Search size={16} />
                        <input
                            placeholder="Search discussions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="rooms-sort-box">
                        <Filter size={16} />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="popular">Most Members</option>
                            <option value="newest">Newest First</option>
                            <option value="az">A-Z</option>
                        </select>
                    </div>
                    <button className="rooms-create-btn" onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} /> <span>Create</span>
                    </button>
                </div>
            </div>

            {/* ── Layout Grid ── */}
            <div className="rooms-grid">
                {displayedRooms.length > 0 ? displayedRooms.map(r => {
                    const isJoined = r.members?.includes(user._id);
                    const memberCount = r.members?.length || 0;
                    const cat = getRoomCategory(r);

                    return (
                        <div key={r._id} className="room-card">
                            <div className="room-card-head">
                                <div className="room-card-icon-wrap" data-category={cat}>
                                    {cat === 'Technology' && <Code size={20} />}
                                    {cat === 'Design' && <Palette size={20} />}
                                    {cat === 'Science' && <FlaskConical size={20} />}
                                    {cat === 'General' && <MessageSquare size={20} />}
                                </div>
                                <div className="room-card-badges">
                                    <span className="room-cat-badge">{cat}</span>
                                    {memberCount > 5 && <span className="room-hot-badge"><Zap size={12}/> Hot</span>}
                                </div>
                            </div>

                            <div className="room-card-body">
                                <h3 className="room-card-title">{r.name}</h3>
                                <p className="room-card-desc">{r.description || 'No description provided.'}</p>
                            </div>

                            <div className="room-card-foot">
                                <div className="room-member-count">
                                    <Users size={14} /> <span>{memberCount}</span>
                                </div>
                                <div className="room-actions-wrapper">
                                    <button
                                        className={`room-action-btn ${isJoined ? 'joined' : ''}`}
                                        onClick={() => toggleJoin(r._id)}
                                    >
                                        {isJoined ? 'Joined ✓' : 'Join'}
                                    </button>
                                    {isJoined && (
                                        <button
                                            className="room-action-btn enter"
                                            onClick={() => onEnterRoom && onEnterRoom(r)}
                                        >
                                            Enter
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="rooms-empty">
                        <div className="rooms-empty-icon"><Search size={48} /></div>
                        <h3>No discussion rooms found</h3>
                        <p>Try adjusting your filters or search query.</p>
                        <button className="rooms-create-btn outline" onClick={() => setShowCreateModal(true)}>
                            Create a Room
                        </button>
                    </div>
                )}
            </div>

            {/* ── Create Room Modal ── */}
            {showCreateModal && (
                <div className="rooms-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="rooms-modal" onClick={e => e.stopPropagation()}>
                        <div className="rooms-modal-head">
                            <div className="rooms-modal-icon-bg"><Plus size={24}/></div>
                            <div>
                                <h2>Create New Room</h2>
                                <p>Start a new discussion community</p>
                            </div>
                            <button className="rooms-modal-close" onClick={() => setShowCreateModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="rooms-modal-body">
                            <div className="rooms-field">
                                <label>Room Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Frontend Architecture" 
                                    value={newRoomName}
                                    onChange={e => setNewRoomName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="rooms-field">
                                <label>Description (Optional)</label>
                                <textarea 
                                    placeholder="What will this room discuss?" 
                                    value={newRoomDesc}
                                    onChange={e => setNewRoomDesc(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="rooms-modal-foot">
                            <button className="rooms-cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button 
                                className="rooms-submit-btn" 
                                onClick={handleCreateRoom}
                                disabled={!newRoomName.trim()}
                            >
                                Create Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
