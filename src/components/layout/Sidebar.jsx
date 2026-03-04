import React from 'react';
import {
  LayoutGrid,
  Wallet,
  ArrowRightLeft,
  BookOpen,
  Zap,
  History,
  Users,
  Star,
  MessageCircle,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const MAIN_NAV = [
  { id: 'home', icon: <LayoutGrid size={20} />, label: 'Home' },
  { id: 'materials', icon: <Wallet size={20} />, label: 'Skill Points' },
  { id: 'rooms', icon: <ArrowRightLeft size={20} />, label: 'Skill Exchange' },
  { id: 'explore', icon: <BookOpen size={20} />, label: 'Materials Hub' },
  { id: 'labs', icon: <Zap size={20} />, label: 'Active Labs' },
  { id: 'activity', icon: <History size={20} />, label: 'Activity' },
];

const COMMUNITY_NAV = [
  { id: 'my-rooms', icon: <Users size={20} />, label: 'My Rooms' },
  { id: 'messages', icon: <MessageCircle size={20} />, label: 'Chat' },
];

export default function Sidebar({ currentTab, onNavigate, onLogout }) {
  return (
    <aside className="gemink-sidebar">
      <div className="sidebar-header">
        <div className="brand" onClick={() => onNavigate('home')}>
          <div className="brand-logo">
            <div className="logo-square">
              <div className="logo-dot" />
            </div>
          </div>
          <span className="brand-name">think<span>grid</span></span>
        </div>
      </div>

      <div className="sidebar-sections">
        <nav className="nav-group">
          {MAIN_NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {currentTab === item.id && <div className="active-arrow">›</div>}
            </button>
          ))}
        </nav>

        <div className="nav-divider" />

        <nav className="nav-group">
          <h4 className="group-title">Community</h4>
          {COMMUNITY_NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item profile-trigger" onClick={() => onNavigate('profile')}>
          <span className="nav-icon"><User size={20} /></span>
          <span className="nav-label">Profile</span>
        </button>
        <button className="nav-item logout-btn" onClick={onLogout}>
          <span className="nav-icon"><LogOut size={20} /></span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
