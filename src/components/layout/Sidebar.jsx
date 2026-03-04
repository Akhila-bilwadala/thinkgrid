import React from 'react';
import {
  LayoutGrid,
  Video,
  Users,
  Bookmark,
  Star,
  MessageCircle,
  User
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'home', icon: <LayoutGrid size={24} />, label: 'Dashboard' },
  { id: 'rooms', icon: <Video size={24} />, label: 'Rooms' },
  { id: 'materials', icon: <Bookmark size={24} />, label: 'Materials' },
  { id: 'explore', icon: <Star size={24} />, label: 'Explore' },
  { id: 'messages', icon: <MessageCircle size={24} />, label: 'Messages' },
  { id: 'profile', icon: <User size={24} />, label: 'Profile' },
];

export default function Sidebar({ currentTab, onNavigate }) {
  return (
    <aside className="gemink-sidebar">
      <div className="sidebar-top">
        <div className="gemink-logo" onClick={() => onNavigate('home')}>
          <div className="logo-inner">TG</div>
        </div>
      </div>

      <nav className="mini-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`mini-nav-btn ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
          >
            {item.icon}
            {currentTab === item.id && <div className="nav-indicator" />}
          </button>
        ))}
      </nav>

    </aside>
  );
}
