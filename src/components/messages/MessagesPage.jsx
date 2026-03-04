import React, { useState } from 'react';
import { Send, Image, Paperclip, MoreVertical, Search, Phone, Video } from 'lucide-react';
import './MessagesPage.css';

const MOCK_CHATS = [
    { id: 1, name: 'Jordan Lee', lastMsg: 'I can help you master FastAPI...', time: '10m', active: true, unread: 2 },
    { id: 2, name: 'Priya Sharma', lastMsg: 'The notes are attached below.', time: '1h', active: false, unread: 0 },
    { id: 3, name: 'Dr. Sarah Venn', lastMsg: 'Excellent progress on the DBMS task.', time: '2d', active: false, unread: 0 },
];

const MessagesPage = () => {
    const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0]);

    return (
        <div className="messages-page animate-fade">
            <div className="messages-container glass">
                <aside className="chats-sidebar">
                    <div className="sidebar-header-mini">
                        <h3>Messages</h3>
                        <div className="search-chats glass">
                            <Search size={14} />
                            <input type="text" placeholder="Search chats..." />
                        </div>
                    </div>
                    <div className="chats-list">
                        {MOCK_CHATS.map(chat => (
                            <div
                                key={chat.id}
                                className={`chat-snippet ${selectedChat.id === chat.id ? 'active' : ''}`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div className="chat-avatar">
                                    {chat.name.split(' ').map(n => n[0]).join('')}
                                    {chat.active && <div className="online-indicator" />}
                                </div>
                                <div className="chat-info-mini">
                                    <div className="chat-row">
                                        <span className="chat-name">{chat.name}</span>
                                        <span className="chat-time">{chat.time}</span>
                                    </div>
                                    <p className="chat-preview">{chat.lastMsg}</p>
                                </div>
                                {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="chat-window">
                    {selectedChat ? (
                        <>
                            <header className="chat-header">
                                <div className="chat-header-user">
                                    <div className="chat-avatar small">
                                        {selectedChat.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="chat-header-meta">
                                        <span className="chat-header-name">{selectedChat.name}</span>
                                        <span className="chat-header-status">online</span>
                                    </div>
                                </div>
                                <div className="chat-actions">
                                    <button className="icon-btn"><Phone size={18} /></button>
                                    <button className="icon-btn"><Video size={18} /></button>
                                    <button className="icon-btn"><MoreVertical size={18} /></button>
                                </div>
                            </header>

                            <div className="chat-messages">
                                <div className="msg-divider"><span>Today</span></div>
                                <div className="message received">
                                    <p>Hey Alex! I saw your request for SQL help. I'm definitely interested in learning Python from you.</p>
                                    <span className="msg-time">10:42 AM</span>
                                </div>
                                <div className="message sent">
                                    <p>That's great! I have some experience with FastAPI as well if you want to dive deeper into the backend.</p>
                                    <span className="msg-time">10:45 AM</span>
                                </div>
                                <div className="message received">
                                    <p>FastAPI would be amazing. Are you free this weekend for a session?</p>
                                    <span className="msg-time">10:46 AM</span>
                                </div>
                            </div>

                            <footer className="chat-input-area">
                                <div className="input-actions">
                                    <button className="icon-btn"><Paperclip size={20} /></button>
                                    <button className="icon-btn"><Image size={20} /></button>
                                </div>
                                <div className="input-wrapper glass">
                                    <input type="text" placeholder="Type a message..." />
                                    <button className="send-btn">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </footer>
                        </>
                    ) : (
                        <div className="no-chat">
                            <MessageSquare size={48} className="no-chat-icon" />
                            <h3>Select a chat to start swapping knowledge</h3>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MessagesPage;
