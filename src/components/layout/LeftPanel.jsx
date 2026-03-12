import React from 'react';
import { MessageSquare, Users, Book, Search } from 'lucide-react';
import './LeftPanel.css';

const SHORTCUTS = [
    { id: 'rooms', Icon: MessageSquare, label: 'Discussions Room' },
    { id: 'explore', Icon: Users, label: 'Connect' },
    { id: 'materials', Icon: Book, label: 'Materials' },
];

export default function LeftPanel({ onNavigate }) {
    return (
        <aside className="tg-left">
            {/* Profile Card */}
            <div className="tg-profile-card card">
                <div className="tg-cover">
                    <img src="/mountain.png" alt="cover" className="tg-cover-img" />
                </div>
                <div className="tg-profile-body">
                    <div className="tg-avatar-wrap">
                        <img src="/bogdan.png" alt="Alex Smith" className="tg-avatar" />
                        <span className="tg-online-dot" />
                    </div>
                    <div className="tg-profile-name">Alex Smith</div>
                    <div className="tg-profile-handle">@alexsmith_</div>
                    <div className="tg-profile-stats">
                        <div className="tg-stat"><div className="tg-stat-num">24</div><div className="tg-stat-label">Posts</div></div>
                        <div className="tg-stat-divider" />
                        <div className="tg-stat"><div className="tg-stat-num">138</div><div className="tg-stat-label">Connections</div></div>
                        <div className="tg-stat-divider" />
                        <div className="tg-stat"><div className="tg-stat-num">12</div><div className="tg-stat-label">Sessions</div></div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => onNavigate('profile')}>
                        My Profile
                    </button>
                </div>
            </div>

            {/* Shortcuts */}
            <div className="tg-shortcuts">
                <div className="tg-section-header">
                    <span>Your shortcuts</span>
                    <a className="tg-see-all">See all</a>
                </div>
                {SHORTCUTS.map(s => (
                    <button key={s.id} className="tg-shortcut" onClick={() => onNavigate(s.id)}>
                        <span className="tg-shortcut-icon"><s.Icon size={18} /></span>
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Score Card */}
            <div className="tg-score-card card">
                <div className="tg-score-title">⭐ Contribution Score</div>
                <div className="tg-score-num">1,250</div>
                <div className="tg-score-bar-wrap">
                    <div className="tg-score-bar" style={{ width: '62%' }} />
                </div>
                <div className="tg-score-next">438 pts to next rank: <b>Mentor</b></div>
            </div>
        </aside>
    );
}
