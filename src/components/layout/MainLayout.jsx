import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './MainLayout.css';

export default function MainLayout({ children, current, onNavigate }) {
    return (
        <div className={`gemink-root ${current === 'messages' ? 'is-messages' : ''}`}>
            <Sidebar currentTab={current} onNavigate={onNavigate} />

            <div className="main-container">
                {current === 'home' && <Navbar onNavigate={onNavigate} />}
                <div className="scroll-viewport">
                    <main className={current === 'messages' ? 'full-screen-main' : 'content-grid'}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
