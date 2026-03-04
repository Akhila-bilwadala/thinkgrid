import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Phone,
    Video,
    Info,
    Send,
    Mic,
    Plus,
    Smile,
    ArrowLeft,
    UserPlus
} from 'lucide-react';
import './Messages.css';

const CONVOS = [
    { id: 1, name: 'Ravi Kumar', avatar: '🧑‍💻', preview: 'Sure! Let\'s do the SQL session Saturday', time: '12:38', unread: 3, active: true },
    { id: 2, name: 'Dr. Sarah Venn', avatar: '👩‍🏫', preview: 'Great question! Here is the BCNF example…', time: '11:15', unread: 1, active: false },
    { id: 3, name: 'Sneha Reddy', avatar: '👩‍💻', preview: 'I can teach you SQL this weekend if free', time: 'Yesterday', unread: 0, active: false },
    { id: 4, name: 'Placement Prep', avatar: '🎯', preview: 'Arjun: Anyone solved the array rotation?', time: 'Oct 15', unread: 7, active: false },
    { id: 5, name: 'Kevin D\'Souza', avatar: '👨‍💻', preview: 'Thanks for the DSA resource!', time: 'Oct 12', unread: 0, active: false },
];

const MSGS = [
    { from: 'them', text: 'Hey! I saw your skill exchange request. I can teach Python — I\'m free evenings.', time: '10:05' },
    { from: 'me', text: 'That\'s great! I can help you with SQL. When would you like to start?', time: '10:12' },
    { from: 'them', text: 'Saturday 6 PM works for me. Video call via Google Meet?', time: '11:20' },
    { from: 'me', text: 'Perfect! I\'ll send a meet link Saturday morning. Looking forward to it! 🎉', time: '11:30' },
    { from: 'them', text: 'Sure! Let\'s do the SQL session Saturday', time: '12:38' },
];

export default function Messages() {
    const [active, setActive] = useState(1);
    const [input, setInput] = useState('');
    const activeConvo = CONVOS.find(c => c.id === active);

    return (
        <div className="messages-glass-container">
            {/* Conversations Sidebar */}
            <div className="msg-sidebar">
                <div className="msg-sidebar-header">
                    <h2>Messages</h2>
                </div>
                <div className="msg-list-scroll">
                    {CONVOS.map(c => (
                        <div
                            key={c.id}
                            className={`convo-item ${active === c.id ? 'active' : ''}`}
                            onClick={() => setActive(c.id)}
                        >
                            <div className="convo-avatar">{c.avatar}</div>
                            <div className="convo-info">
                                <div className="convo-name-row">
                                    <span className="convo-name">{c.name}</span>
                                    <span className="convo-time">{c.time}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="convo-preview">{c.preview}</div>
                                    <Mic size={14} style={{ color: 'var(--text-3)', marginLeft: 8 }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '20px' }}>
                    <button className="add-contact-btn">
                        Add Contact <UserPlus size={18} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-glass-window">
                <div className="chat-glass-header">
                    <div className="header-user">
                        <button className="action-icon-btn" style={{ marginRight: 10, background: 'none', width: 'auto' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div className="header-avatar" style={{ width: 44, height: 44 }}>{activeConvo?.avatar}</div>
                        <div>
                            <div className="header-name">{activeConvo?.name}</div>
                            <div className="header-status">
                                (217) 555-0113
                            </div>
                        </div>
                    </div>
                    <div className="chat-actions">
                        <button className="action-icon-btn"><Phone size={18} /></button>
                        <button className="action-icon-btn"><Video size={18} /></button>
                        <button className="action-icon-btn"><Info size={18} /></button>
                    </div>
                </div>

                <div className="glass-chat-msgs">
                    {MSGS.map((m, i) => (
                        <div key={i} className={`glass-bubble ${m.from}`}>
                            {m.text}
                            <span className="bubble-time">{m.time}</span>
                        </div>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: 'auto', padding: '20px 0' }}>
                        <span style={{ fontSize: '1.2rem', color: 'var(--text-3)' }}>...</span>
                    </div>
                </div>

                <div className="glass-chat-input-row">
                    <div className="glass-input-wrapper">
                        <input
                            type="text"
                            className="glass-input-field"
                            placeholder="I mean have you |"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="mic-btn" style={{ marginRight: '15px' }}><Mic size={22} /></button>
                    </div>
                    <button className="glass-send-btn" onClick={() => setInput('')}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
