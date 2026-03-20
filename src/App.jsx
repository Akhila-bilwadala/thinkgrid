import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Rooms from './pages/Rooms';
import Materials from './pages/Materials';
import Explore from './pages/Explore';
import Labs from './pages/Labs';
import Activity from './pages/Activity';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomDetail from './pages/RoomDetail';
import AIStudyTools from './pages/AIStudyTools';
import Footer from './components/layout/Footer';
import './pages/pages.css';

import { useAuth } from './context/AuthContext';

function App() {
  const [tab, setTab] = useState(() => localStorage.getItem('activeRoomId') ? 'room-detail' : 'home');
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user, loading, logout } = useAuth();

  // Effect to load active room details if ID is in localStorage
  React.useEffect(() => {
    const activeRoomId = localStorage.getItem('activeRoomId');
    if (activeRoomId && !selectedRoom) {
      // Fetch room detail and set selectedRoom
      import('./api/rooms').then(({ getRoom }) => {
        getRoom(activeRoomId).then(data => {
          setSelectedRoom(data);
          setTab('room-detail');
        }).catch(err => {
          console.error('Failed to load active room:', err);
          localStorage.removeItem('activeRoomId');
          setTab('home');
        });
      });
    }
  }, []);

  const navigateToRoom = (room) => {
    setSelectedRoom(room);
    localStorage.setItem('activeRoomId', room._id);
    setTab('room-detail');
  };

  const renderPage = () => {
    if (tab === 'room-detail' && selectedRoom) {
      return <RoomDetail room={selectedRoom} onBack={() => { setTab('rooms'); setSelectedRoom(null); }} />;
    }
    switch (tab) {
      case 'home': return <Home onNavigate={setTab} />;
      case 'profile': return <Profile />;
      case 'rooms': 
        const activeRoomId = localStorage.getItem('activeRoomId');
        if (activeRoomId && selectedRoom) {
          // If we navigate to "Rooms" but already have an active room, show it.
          return <RoomDetail room={selectedRoom} onBack={() => setTab('home')} />;
        }
        return <Rooms currentTab={tab} onEnterRoom={navigateToRoom} />;
      case 'materials': return <Materials />;
      case 'aistudy': return <AIStudyTools />;
      case 'explore': return <Explore />;
      case 'labs': return <Labs />;
      case 'activity': return <Activity onEnterRoom={navigateToRoom} />;
      case 'notifications':
        return (
          <div className="card animate-up" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔔</div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Notifications</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '.84rem' }}>You have 7 new notifications — answers, skill requests, and room activity.</p>
          </div>
        );
      default:
        return (
          <div className="card animate-up" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚧</div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '.84rem' }}>This section is coming soon on ThinkGrid.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0F1A', color: 'white' }}>
        <div className="loader">ThinkGrid...</div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login'
      ? <Login onSwitch={() => setAuthView('register')} />
      : <Register onSwitch={() => setAuthView('login')} />;
  }

  return (
    <MainLayout current={tab} onNavigate={setTab} user={user} onLogout={logout}>
      <div className="app-content-wrapper">
        {renderPage()}
        {tab === 'home' && <Footer />}
      </div>
    </MainLayout>
  );
}

export default App;
