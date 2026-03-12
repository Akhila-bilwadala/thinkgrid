import React, { useState } from 'react';
import { 
    Search, Phone, Video, Info, Send, Plus, 
    ArrowLeft, MoreVertical, Paperclip, Smile,
    Files, Image as ImageIcon, Link as LinkIcon,
    Settings, LogOut, ShieldAlert
} from 'lucide-react';
import './Messages.css';

const CONVOS = [
    { 
        id: 1, name: 'Alice Smith', avatar: '/default-avatar.png', 
        preview: 'Senior Project Manager @TechFlow', unread: 2, online: true,
        role: 'Senior Project Manager', company: 'TechFlow'
    },
    { 
        id: 2, name: 'Bob Johnson', avatar: '/default-avatar.png', 
        preview: 'Fullstack Developer @Orbit Tech', unread: 0, online: false,
        role: 'Fullstack Developer', company: 'Orbit Tech'
    },
    { 
        id: 3, name: 'Dr. Sarah Venn', avatar: '/default-avatar.png', 
        preview: 'SQL Specialist @EduGrid', unread: 5, online: true,
        role: 'SQL Specialist', company: 'EduGrid'
    },
    { 
        id: 4, name: 'James Wilson', avatar: '/default-avatar.png', 
        preview: 'Cloud Architect @DevOps Inc', unread: 0, online: true,
        role: 'Cloud Architect', company: 'DevOps Inc'
    },
];

export default function Messages() {
    const [active, setActive] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const activeConvo = CONVOS.find(c => c.id === active);

    const filteredConvos = CONVOS.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="elite-chat-layout animate-up">
            
            {/* 1. Sidebar: Connection List */}
            <div className="chat-left-sidebar">
                <div className="chat-sidebar-head">
                    <h2>Connections</h2>
                    <div className="chat-search-premium">
                        <Search size={14} />
                        <input
                            type="text"
                            placeholder="Find a talk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="chat-scroll-list">
                    {filteredConvos.map(c => (
                        <div
                            key={c.id}
                            className={`chat-convo-item ${active === c.id ? 'active' : ''}`}
                            onClick={() => setActive(c.id)}
                        >
                            <div className="convo-avatar-ring">
                                <img src={c.avatar} alt={c.name} />
                                {c.online && <span className="online-dot" />}
                            </div>
                            <div className="convo-summary">
                                <div className="convo-top">
                                    <span className="convo-name">{c.name}</span>
                                </div>
                                <div className="convo-preview-row">
                                    <span className="convo-preview">{c.preview}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Main Detail Area (Replacing Chat Area) */}
            <div className="chat-directory-view">
                {activeConvo ? (
                    <div className="directory-content animate-slide-in">
                        <div className="directory-header">
                            <div className="header-visual">
                                <img src={activeConvo.avatar} alt={activeConvo.name} className="large-avatar" />
                                <div className="header-text">
                                    <h3>{activeConvo.name}</h3>
                                    <p>{activeConvo.role}</p>
                                    <span className="details-company">@{activeConvo.company}</span>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button className="glass-icon-btn"><Phone size={18} /></button>
                                <button className="glass-icon-btn"><Video size={18} /></button>
                                <button className="elite-primary-btn">Collaborate</button>
                            </div>
                        </div>

                        <div className="directory-body">
                            <div className="directory-section">
                                <h4>Shared Materials</h4>
                                <div className="asset-grid">
                                    <div className="asset-card">
                                        <div className="asset-icon"><Files size={20} /></div>
                                        <span>Project_Specs.pdf</span>
                                        <p>1.2 MB • PDF File</p>
                                    </div>
                                    <div className="asset-card">
                                        <div className="asset-icon pink"><ImageIcon size={20} /></div>
                                        <span>Landing_Draft.png</span>
                                        <p>4.5 MB • Image</p>
                                    </div>
                                </div>
                            </div>

                            <div className="directory-section">
                                <h4>Quick Links</h4>
                                <div className="links-list">
                                    <button className="link-item"><Settings size={16} /> Connection Settings</button>
                                    <button className="link-item danger"><LogOut size={16} /> Remove Connection</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="directory-footer">
                            <p>Messaging for this connection will be enabled soon.</p>
                        </div>
                    </div>
                ) : (
                    <div className="chat-placeholder-view">
                        <div className="placeholder-icon-wrap">
                            <Plus size={40} />
                        </div>
                        <h2>Your Connection Directory</h2>
                        <p>Select a peer to view details and shared materials</p>
                    </div>
                )}
            </div>
        </div>
    );
}
