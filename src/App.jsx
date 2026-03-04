import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Rooms from './pages/Rooms';
import Materials from './pages/Materials';
import Explore from './pages/Explore';
import Labs from './pages/Labs';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/layout/Footer';
import './pages/pages.css';

function App() {
  const [tab, setTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const renderPage = () => {
    switch (tab) {
      case 'home': return <Home onNavigate={setTab} />;
      case 'profile': return <Profile />;
      case 'rooms':
      case 'my-rooms': return <Rooms currentTab={tab} />;
      case 'materials': return <Materials />;
      case 'explore': return <Explore />;
      case 'labs': return <Labs />;
      case 'messages': return <Messages />;
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

  if (!isAuthenticated) {
    return authView === 'login'
      ? <Login onLogin={handleLogin} onSwitch={() => setAuthView('register')} />
      : <Register onRegister={handleLogin} onSwitch={() => setAuthView('login')} />;
  }

  return (
    <MainLayout current={tab} onNavigate={setTab} user={user} onLogout={handleLogout}>
      <div className="app-content-wrapper">
        {renderPage()}
        {tab === 'home' && <Footer />}
      </div>
    </MainLayout>
  );
}

export default App;
