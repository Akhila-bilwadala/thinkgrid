import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || 'Login failed');
        return;
      }

      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        return;
      }

      // Store token separately for admin session
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      onLogin(data.user, data.token);
    } catch (err) {
      setError('Connection error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-root">
      <div className="admin-login-backdrop" />

      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-shield">⬡</div>
          <h1>THINKGRID</h1>
          <p className="admin-subtitle">ADMIN PORTAL</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@123"
              required
              autoComplete="off"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="admin-error-msg">{error}</div>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS ADMIN PANEL →'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="back-to-site">← Back to ThinkGrid</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
