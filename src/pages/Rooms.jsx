import React, { useState, useEffect } from 'react';
import { Search, Plus, Image as ImageIcon, X } from 'lucide-react';
import './Rooms.css';
import { getRooms, joinRoom, leaveRoom, createRoom } from '../api/rooms';
import { useAuth } from '../context/AuthContext';

export default function Rooms({ currentTab, onEnterRoom }) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
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
                // Auto-enter room
                if (onEnterRoom) onEnterRoom(updatedRoom);
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

    const displayed = rooms.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isJoined = r.members?.includes(user._id);
        const matchesTab = currentTab === 'my-rooms' ? isJoined : true;
        return matchesSearch && matchesTab;
    });

    if (loading) return <div className="loading-state">Entering Thought Corridors...</div>;

    return (
        <div className="rooms-container">
            {/* Header */}
            <div className="rooms-header-block">
                <div className="rooms-header-text">
                    <h1>{currentTab === 'my-rooms' ? 'My Rooms' : 'Discussions Room'}</h1>
                    <p>{currentTab === 'my-rooms' ? 'Communities you are currently participating in.' : 'Connect with peers to share knowledge and discuss topics.'}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="rooms-search-wrapper">
                        <Search size={18} />
                        <input
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)} 
                        style={{ background: '#111827', color: 'white', padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Plus size={18} /> Create
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="rooms-wf-grid">
                {displayed.length > 0 ? displayed.map(r => {
                    const isJoined = r.members?.includes(user._id);
                    return (
                        <div key={r._id} className="room-wf-card">
                            <div className="room-wf-cover">
                                <img src={r.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'} alt={r.name} className="room-wf-image" />
                            </div>

                        <div className="room-wf-content">
                                <h3 className="room-wf-title">{r.name}</h3>
                                <p className="room-wf-desc">{r.description}</p>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className={`room-wf-action ${isJoined ? 'joined' : ''}`}
                                        onClick={() => toggleJoin(r._id)}
                                    >
                                        {isJoined ? 'Joined ✓' : 'Join Room'}
                                    </button>
                                    {isJoined && (
                                        <button
                                            className="room-wf-action"
                                            style={{ background: '#111827', color: 'white' }}
                                            onClick={() => onEnterRoom && onEnterRoom(r)}
                                        >
                                            Enter Room →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="no-results">No rooms found. Be the first to create one!</div>
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCreateModal(false)}>
                    <div style={{ background: 'white', padding: '24px 28px', borderRadius: '16px', width: '100%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Create Room</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={22} color="#6B7280" /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Room Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Frontend Developers..." 
                                    value={newRoomName}
                                    onChange={e => setNewRoomName(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#F9FAFB', color: '#111827', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Description (Optional)</label>
                                <textarea 
                                    placeholder="What is this room about?" 
                                    value={newRoomDesc}
                                    onChange={e => setNewRoomDesc(e.target.value)}
                                    style={{ width: '100%', minHeight: '80px', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#F9FAFB', color: '#111827', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                        <button onClick={handleCreateRoom} style={{ width: '100%', background: '#111827', color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Create Discussion Room</button>
                    </div>
                </div>
            )}
        </div>
    );
}
