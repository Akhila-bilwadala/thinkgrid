import React, { useState } from 'react';
import { Users, Hash, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import './DiscussionRooms.css';

const MOCK_ROOMS = [
    { id: 1, name: 'Placement Prep 2026', category: 'Career', activeUsers: 156, trending: true },
    { id: 2, name: 'DSA Beginners', category: 'Academic', activeUsers: 84, trending: true },
    { id: 3, name: 'React Advanced Patterns', category: 'Tech', activeUsers: 42, trending: false },
    { id: 4, name: 'DBMS Normalization', category: 'Academic', activeUsers: 28, trending: false },
];

const DiscussionRooms = () => {
    return (
        <div className="rooms-container-v2 animate-fade">
            <header className="rooms-header-v2">
                <div className="header-text-v2">
                    <h2 className="gradient-text">Public Rooms</h2>
                    <p>Join live academic discussions and collaborative study sessions.</p>
                </div>
                <button className="create-room-btn">
                    <Plus size={18} />
                    <span>Create Room</span>
                </button>
            </header>

            <div className="rooms-grid-v2">
                {MOCK_ROOMS.map(room => (
                    <div key={room.id} className="room-card-v2 premium-card">
                        <div className="room-v2-header">
                            <div className="room-v2-icon">
                                <Hash size={20} />
                            </div>
                            <div className="room-v2-meta">
                                <span className="room-v2-category">{room.category}</span>
                                {room.trending && <span className="trending-badge"><TrendingUp size={12} /> Trending</span>}
                            </div>
                        </div>

                        <h3 className="room-v2-name">{room.name}</h3>

                        <div className="room-v2-footer">
                            <div className="active-community">
                                <div className="user-dots">
                                    <div className="u-dot" style={{ background: 'var(--accent-blue)' }}></div>
                                    <div className="u-dot" style={{ background: 'var(--accent-purple)' }}></div>
                                    <div className="u-dot" style={{ background: 'var(--accent-cyan)' }}></div>
                                </div>
                                <span>{room.activeUsers} active now</span>
                            </div>
                            <button className="join-room-btn-v2">Join</button>
                        </div>
                    </div>
                ))}
            </div>

            <section className="private-rooms-section">
                <div className="section-title-row">
                    <div className="title-icon glass"><Users size={18} /></div>
                    <h3>Your Circles</h3>
                </div>
                <div className="placeholder-circles">
                    <div className="circle-card-v2 glass">
                        <span className="c-name">Final Year Project Group</span>
                        <span className="c-count">4 members</span>
                    </div>
                    <div className="circle-card-v2 glass">
                        <span className="c-name">Off-campus Placement Group</span>
                        <span className="c-count">12 members</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DiscussionRooms;
