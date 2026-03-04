import React, { useState } from 'react';
import { Search, Settings, Bell, ChevronDown, MonitorPlay } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onNavigate }) {
    const [query, setQuery] = useState('');

    return (
        <header className="gemink-topbar">
            {/* Search Bar Group */}
            <div className="search-group">
                <div className="search-pill">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for mentors, skills, topics..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className="search-submit">Search</button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
                <div className="top-icons">
                    <button className="icon-circ"><Settings size={20} /></button>
                    <button className="icon-circ"><Bell size={20} /><div className="notif-dot" /></button>
                </div>

                <div className="top-user-pill" onClick={() => onNavigate('profile')}>
                    <div className="user-avatar-small">AS</div>
                    <div className="user-text">
                        <span className="user-name-small">Alex Smith</span>
                        <span className="user-status-small">Online</span>
                    </div>
                    <ChevronDown size={14} className="chevron" />
                </div>
            </div>
        </header>
    );
}
