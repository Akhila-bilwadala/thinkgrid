import React from 'react';
import Sidebar from './Sidebar';
import { Bell, User } from 'lucide-react';
import './MainLayout.css';

export default function MainLayout({ children, current, onNavigate, user, onLogout }) {
    return (
        <div className={`gemink-root ${current === 'messages' ? 'is-messages' : ''}`}>
            <Sidebar currentTab={current} onNavigate={onNavigate} onLogout={onLogout} user={user} />

            <div className="main-container">
                {current !== 'messages' && current !== 'room-detail' && (
                    <div className="top-bar">
                        <div className="top-bar-icon" onClick={() => onNavigate('notifications')}>
                            <Bell size={18} />
                            <span className="notif-badge" />
                        </div>
                        <div className="top-bar-icon" onClick={() => onNavigate('profile')}>
                            <User size={18} />
                        </div>
                    </div>
                )}
                <div className="scroll-viewport">
                    <main className={current === 'messages' ? 'full-screen-main' : 'content-grid'}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
