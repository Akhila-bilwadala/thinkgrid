import React from 'react';
import { Plus, Shield, Swords, Target } from 'lucide-react';
import './RightPanel.css';

const USERS = [
    { id: 1, avatar: '/default-avatar.png', status: 'online' },
    { id: 2, avatar: '/default-avatar.png', status: 'online' },
    { id: 3, avatar: '/default-avatar.png', status: 'offline' },
    { id: 4, avatar: '/default-avatar.png', status: 'online' },
    { id: 5, avatar: '/default-avatar.png', status: 'online' },
    { id: 6, avatar: '/default-avatar.png', status: 'online' },
];

const GAMES = [
    { id: 1, Icon: Shield, label: 'Valorant' },
    { id: 2, Icon: Swords, label: 'League' },
    { id: 3, Icon: Target, label: 'Dota 2' },
];

export default function RightPanel() {
    return (
        <aside className="gemink-right-panel">
            {/* User Avatars List */}
            <div className="status-column">
                <div className="avatar-stack">
                    {USERS.map(user => (
                        <div key={user.id} className="avatar-wrapper">
                            <img src={user.avatar} alt="User" className="status-avatar" />
                            <div className={`online-indicator ${user.status}`} />
                        </div>
                    ))}
                    <button className="btn-add-status">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="column-divider" />

                <div className="game-stack">
                    {GAMES.map(game => (
                        <div key={game.id} className="game-icon-box" title={game.label}>
                            <game.Icon size={18} />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
