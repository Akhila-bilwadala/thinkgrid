import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Github, Linkedin, Award, Star, Zap, Send, X } from 'lucide-react';
import './Explore.css';
import { getAllUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';

export default function Explore() {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [toast, setToast] = useState({ show: false, message: '', name: '' });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Skill Exchange Modal State
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [exchangeCredits, setExchangeCredits] = useState(50);
    const [exchangeTopic, setExchangeTopic] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filtered = users.filter(u =>
        u._id !== user?._id &&
        (category === 'All' || u.rank === category || (category === 'Mentor' && u.rank?.includes('Mentor'))) &&
        (u.name.toLowerCase().includes(query.toLowerCase()) || u.role?.toLowerCase().includes(query.toLowerCase()))
    );

    const handleConnect = (name) => {
        setToast({ show: true, message: 'Connection request sent successfully!', name });
        setTimeout(() => setToast({ show: false, message: '', name: '' }), 3000);
    };

    const handleExchange = (u) => {
        setSelectedUser(u);
        setShowExchangeModal(true);
    };

    const submitExchange = () => {
        setToast({ show: true, message: `Exchange request for ${exchangeTopic} sent!`, name: selectedUser.name });
        setShowExchangeModal(false);
        setExchangeTopic('');
        setTimeout(() => setToast({ show: false, message: '', name: '' }), 3000);
    };

    if (loading) return <div className="loading-state">Finding Elite thinkers...</div>;

    return (
        <div className="mhub-container">
            {/* Success Toast */}
            {toast.show && (
                <div className="elite-toast animate-up">
                    <div className="toast-icon">✓</div>
                    <div className="toast-content">
                        <span className="toast-name">{toast.name}</span>
                        <span className="toast-msg">{toast.message}</span>
                    </div>
                </div>
            )}
            {/* Toolbar */}
            <div className="mhub-toolbar">
                <div className="mhub-search">
                    <Search size={18} className="mhub-search-icon" />
                    <input
                        placeholder="Search contributors, mentors..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <div className="mhub-pills">
                    {['All', 'Mentor', 'Member'].map(c => (
                        <button
                            key={c}
                            className={`mhub-pill ${category === c ? 'active' : ''}`}
                            onClick={() => setCategory(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="mhub-grid">
                {filtered.length > 0 ? filtered.map(u => (
                    <div key={u._id} className="mhub-card">
                        {/* Three-dot menu */}
                        <button className="mhub-card-menu">
                            <MoreVertical size={18} />
                        </button>

                        {/* Avatar */}
                        <div className="mhub-avatar-wrap">
                            <img src={u.picture || '/default-avatar.png'} alt={u.name} className="mhub-avatar" />
                        </div>

                        {/* Name & Role */}
                        <h3 className="mhub-name">{u.name}</h3>
                        <p className="mhub-role-mid">{u.role || 'Member'}</p>

                        {/* Social Links */}
                        <div className="mhub-socials">
                            <a href="#" className="mhub-social-icon"><Github size={20} /></a>
                            <a href="#" className="mhub-social-icon"><Linkedin size={20} /></a>
                        </div>

                        {/* Divider */}
                        <div className="mhub-card-divider" />

                        {/* Action Buttons */}
                        <div className="mhub-actions">
                            <button 
                                className="mhub-btn-connect"
                                onClick={() => handleConnect(u.name)}
                            >
                                Connect
                            </button>
                            <button 
                                className="mhub-btn-exchange"
                                onClick={() => handleExchange(u)}
                            >
                                Exchange
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="no-results">No thinkers found matching your search.</div>
                )}
            </div>
            {/* Skill Exchange Modal */}
            {showExchangeModal && (
                <div className="rd-overlay" onClick={() => setShowExchangeModal(false)}>
                    <div className="ex-modal animate-up" onClick={e => e.stopPropagation()}>
                        <div className="ex-modal-head">
                            <div className="ex-user-info">
                                <img src={selectedUser?.picture || '/default-avatar.png'} className="ex-mini-avatar" alt="" />
                                <div>
                                    <h4 className="ex-title">Exchange with {selectedUser?.name}</h4>
                                    <p className="ex-subtitle">{selectedUser?.role}</p>
                                </div>
                            </div>
                            <button className="rd-close" onClick={() => setShowExchangeModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="ex-modal-body">
                            <div className="ex-input-row">
                                <div className="ex-input-group">
                                    <label>Credits to Offer</label>
                                    <div className="ex-input-wrapper">
                                        <Zap size={16} className="ex-zap-icon" />
                                        <input 
                                            type="number" 
                                            value={exchangeCredits}
                                            onChange={e => setExchangeCredits(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="ex-input-group">
                                    <label>Skill Topic</label>
                                    <div className="ex-input-wrapper">
                                        <input 
                                            placeholder="e.g. Machine Learning" 
                                            value={exchangeTopic}
                                            onChange={e => setExchangeTopic(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="ex-pricing-grid">
                                <div className="ex-price-item">
                                    <span>Platform Fee:</span>
                                    <strong>5 pts</strong>
                                </div>
                                <div className="ex-price-item total">
                                    <span>Total:</span>
                                    <strong>{Number(exchangeCredits) + 5} pts</strong>
                                </div>
                            </div>

                            <button className="ex-submit-btn" onClick={submitExchange}>
                                <Send size={18} />
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
