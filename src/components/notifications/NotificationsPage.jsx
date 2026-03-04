import React from 'react';
import { Bell, Heart, MessageCircle, ArrowLeftRight, UserPlus, Zap } from 'lucide-react';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const notifications = [
        { id: 1, type: 'swap', user: 'Jordan Lee', action: 'sent you a skill swap proposal', time: '10m ago', icon: <ArrowLeftRight size={14} /> },
        { id: 2, type: 'like', user: 'Dr. Sarah Venn', action: 'upvoted your answer on DBMS Normalization', time: '1h ago', icon: <Zap size={14} /> },
        { id: 3, type: 'mention', user: 'Sam Wilson', action: 'mentioned you in a discussion', time: '3h ago', icon: <MessageCircle size={14} /> },
        { id: 4, type: 'follow', user: 'University Academics', action: 'started following your learning path', time: '5h ago', icon: <UserPlus size={14} /> },
    ];

    return (
        <div className="notifications-page animate-fade">
            <header className="page-header-v2">
                <h2 className="gradient-text">Activity Feed</h2>
                <div className="header-actions">
                    <button className="chip active">All</button>
                    <button className="chip">Mentions</button>
                    <button className="chip">Swaps</button>
                </div>
            </header>

            <div className="notifications-list glass">
                {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item-v2">
                        <div className={`notif-icon-v2 ${notif.type}`}>
                            {notif.icon}
                        </div>
                        <div className="notif-content-v2">
                            <p>
                                <span className="notif-user">{notif.user}</span> {notif.action}
                            </p>
                            <span className="notif-time">{notif.time}</span>
                        </div>
                        <div className="notif-status"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;
