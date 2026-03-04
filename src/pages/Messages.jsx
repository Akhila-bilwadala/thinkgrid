import React, { useState } from 'react';
import { Search, Phone, Video, Info, Send, Plus, ArrowLeft, UserPlus } from 'lucide-react';
import './Messages.css';

const CONVOS = [
    { id: 1, name: 'Alice Smith', avatar: '👩‍💼', preview: 'Sounds good! See you then.', time: '10:42 AM', unread: 2, active: true },
    { id: 2, name: 'Bob Johnson', avatar: '👨‍💻', preview: 'Can you review my PR when you have a sec?', time: 'Yesterday', unread: 0, active: false },
    { id: 3, name: 'Design Team', avatar: '🎨', preview: 'New mockups are ready for review.', time: 'Tuesday', unread: 5, active: false },
    { id: 4, name: 'Project Alpha', avatar: '🚀', preview: 'Deployment successful!', time: 'Monday', unread: 0, active: false },
];

const MSGS = [
    { id: 1, from: 'them', text: 'Hey there! How is the new feature coming along?', time: '09:15 AM' },
    { id: 2, from: 'me', text: 'It\'s going well! I just finished the backend integration.', time: '09:45 AM' },
    { id: 3, from: 'them', text: 'Awesome. We need to deploy it by Friday.', time: '10:00 AM' },
    { id: 4, from: 'me', text: 'No problem. I should have a PR up for review this afternoon.', time: '10:30 AM' },
    { id: 5, from: 'them', text: 'Sounds good! See you then.', time: '10:42 AM' },
];

export default function Messages() {
    const [active, setActive] = useState(1);
    const [input, setInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const activeConvo = CONVOS.find(c => c.id === active);

    const filteredConvos = CONVOS.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-layout">
            {/* Sidebar (Conversations List) */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>Messages</h2>
                    <div className="chat-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="chat-list">
                    {filteredConvos.map(c => (
                        <div
                            key={c.id}
                            className={`chat-item ${active === c.id ? 'active' : ''}`}
                            onClick={() => setActive(c.id)}
                        >
                            <div className="chat-item-avatar">{c.avatar}</div>
                            <div className="chat-item-info">
                                <div className="chat-item-top">
                                    <span className="chat-item-name">{c.name}</span>
                                    <span className="chat-item-time">{c.time}</span>
                                </div>
                                <div className="chat-item-bottom">
                                    <span className="chat-item-preview">{c.preview}</span>
                                    {c.unread > 0 && <span className="chat-item-unread">{c.unread}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {activeConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-header-avatar">{activeConvo.avatar}</div>
                                <div>
                                    <h3 className="chat-header-name">{activeConvo.name}</h3>
                                    <span className="chat-header-status">Online</span>
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                <button className="chat-icon-btn"><Phone size={18} /></button>
                                <button className="chat-icon-btn"><Video size={18} /></button>
                                <button className="chat-icon-btn"><Info size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="chat-messages">
                            {MSGS.map(msg => (
                                <div key={msg.id} className={`chat-bubble-wrapper ${msg.from}`}>
                                    <div className="chat-bubble">
                                        <p>{msg.text}</p>
                                        <span className="chat-bubble-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="chat-input-area">
                            <button className="chat-attach-btn"><Plus size={20} /></button>
                            <div className="chat-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setInput('')}
                                />
                            </div>
                            <button className="chat-send-btn" onClick={() => setInput('')}>
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="chat-empty-state">
                        <MessageCircle size={48} />
                        <h3>Your Messages</h3>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
