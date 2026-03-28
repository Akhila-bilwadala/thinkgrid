import React, { useState, useEffect } from 'react';
import { ShieldCheck, XCircle, CheckCircle, FileText, Users, FlaskConical, LogOut, RefreshCw } from 'lucide-react';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const AdminDashboard = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [pendingItems, setPendingItems] = useState({ materials: [], rooms: [], labs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { error: text }; }
      
      if (!res.ok) throw new Error(data.error || `Failed to fetch (Status: ${res.status})`);
      
      setPendingItems({
        materials: data.materials || [],
        rooms: data.rooms || [],
        labs: data.projects || data.labs || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (type, id) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`${API_URL}/admin/approve/${type}/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPending();
  };

  const handleReject = async (type, id) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`${API_URL}/admin/reject/${type}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPending();
  };

  const TAB_TYPE_MAP = { materials: 'material', rooms: 'room', labs: 'lab' };

  const items = pendingItems[activeTab] || [];

  return (
    <div className="admin-dashboard">
      {/* ── Top Bar ── */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <ShieldCheck size={20} />
          <span>THINKGRID <strong>ADMIN</strong></span>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-whoami">Logged in as <strong>{adminUser?.name || 'Admin'}</strong></span>
          <button className="admin-logout-btn" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* ── Page Header ── */}
      <header className="admin-header">
        <div>
          <h1>Content Moderation</h1>
          <p>Review and approve user submissions before they go live.</p>
        </div>
        <button className="admin-refresh-btn" onClick={fetchPending}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {/* ── Tabs ── */}
      <nav className="admin-tabs">
        <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>
          <FileText size={18} /> Materials
          <span className="tab-count">{pendingItems.materials.length}</span>
        </button>
        <button className={activeTab === 'rooms' ? 'active' : ''} onClick={() => setActiveTab('rooms')}>
          <Users size={18} /> Rooms
          <span className="tab-count">{pendingItems.rooms.length}</span>
        </button>
        <button className={activeTab === 'labs' ? 'active' : ''} onClick={() => setActiveTab('labs')}>
          <FlaskConical size={18} /> Labs
          <span className="tab-count">{pendingItems.labs.length}</span>
        </button>
      </nav>

      {/* ── Content ── */}
      <main className="admin-main">
        {loading && <div className="admin-state-msg">Loading pending submissions...</div>}
        {error && <div className="admin-state-msg error">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="admin-state-msg">
            <CheckCircle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No pending {activeTab} — you're all caught up!</p>
          </div>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="admin-grid">
            {items.map((item) => (
              <div key={item._id} className="admin-card">
                <div className="admin-card-type">{TAB_TYPE_MAP[activeTab]}</div>
                <h3 className="admin-card-title">{item.title || item.name}</h3>
                <p className="admin-card-desc">{item.description || 'No description provided.'}</p>
                <div className="admin-card-meta">
                  {item.uploadedBy?.name && <span>By: {item.uploadedBy.name}</span>}
                  {item.createdBy?.name && <span>By: {item.createdBy.name}</span>}
                  {item.category && <span>Category: {item.category}</span>}
                  {item.host && <span>Host: {item.host}</span>}
                  <span>Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="admin-card-actions">
                  <button className="admin-btn approve" onClick={() => handleApprove(TAB_TYPE_MAP[activeTab], item._id)}>
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button className="admin-btn reject" onClick={() => handleReject(TAB_TYPE_MAP[activeTab], item._id)}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
