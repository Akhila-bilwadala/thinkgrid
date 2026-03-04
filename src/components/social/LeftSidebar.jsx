import React, { useState } from 'react';

const navItems = [
    { id: 'feed', icon: '📰', label: 'News Feed' },
    { id: 'messages', icon: '✉️', label: 'Messages', badge: 6 },
    { id: 'forums', icon: '💬', label: 'Forums' },
    { id: 'friends', icon: '👥', label: 'Friends', badge: 3 },
    { id: 'media', icon: '🖼️', label: 'Media' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function LeftSidebar() {
    const [active, setActive] = useState('feed');

    return (
        <aside className="sf-left">
            {/* Logo */}
            <div className="sf-logo">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#1a1a2e" />
                    <circle cx="12" cy="14" r="3" fill="#ff6b9d" />
                    <circle cx="28" cy="14" r="3" fill="#7c4dff" />
                    <circle cx="20" cy="26" r="4" fill="#ffd700" />
                    <circle cx="6" cy="22" r="2" fill="#00e5ff" />
                    <circle cx="34" cy="22" r="2" fill="#ff4d6a" />
                </svg>
            </div>

            {/* Profile */}
            <div className="sf-profile-pic">
                <img src="/bogdan.png" alt="Bogdan Nikitin" />
                <span className="sf-profile-dot" />
            </div>
            <div className="sf-profile-name">Bogdan Nikitin</div>
            <div className="sf-profile-handle">@nikitinteam</div>

            {/* Nav */}
            <nav className="sf-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`sf-nav-item${active === item.id ? ' active' : ''}`}
                        onClick={() => setActive(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                        {item.badge && (
                            <span className="sf-nav-badge">{item.badge}</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Download App */}
            <div className="sf-download">
                <div className="sf-download-avatars">
                    <img className="sf-dl-av" src="/bogdan.png" alt="" />
                    <img className="sf-dl-av" src="/hiking.png" alt="" />
                    <img className="sf-dl-av" src="/flower.png" alt="" />
                </div>
                <div style={{ marginTop: 10 }}>Download the App</div>
            </div>
        </aside>
    );
}
