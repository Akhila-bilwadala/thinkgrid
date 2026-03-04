import React from 'react';
import { Plus } from 'lucide-react';
import './RightPanel.css';

const USERS = [
    { id: 1, avatar: 'https://i.pravatar.cc/150?u=1', status: 'online' },
    { id: 2, avatar: 'https://i.pravatar.cc/150?u=2', status: 'online' },
    { id: 3, avatar: 'https://i.pravatar.cc/150?u=3', status: 'offline' },
    { id: 4, avatar: 'https://i.pravatar.cc/150?u=4', status: 'online' },
    { id: 5, avatar: 'https://i.pravatar.cc/150?u=5', status: 'online' },
    { id: 6, avatar: 'https://i.pravatar.cc/150?u=6', status: 'online' },
];

const GAMES = [
    { id: 1, icon: '🛡️', label: 'Valorant' },
    { id: 2, icon: '⚔️', label: 'League' },
    { id: 3, icon: '🏹', label: 'Dota 2' },
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
                            <span className="game-emoji">{game.icon}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
