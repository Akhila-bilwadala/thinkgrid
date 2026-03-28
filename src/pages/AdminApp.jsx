import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminApp = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if already logged in as admin
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.role === 'admin') {
          setAdminUser(parsed);
        }
      } catch {}
    }
    setChecked(true);
  }, []);

  const handleLogin = (user, token) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  if (!checked) return null;

  if (!adminUser) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
};

export default AdminApp;
