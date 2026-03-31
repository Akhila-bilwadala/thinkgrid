import React, { useState, useEffect } from 'react';
import { ShieldCheck, XCircle, CheckCircle, FileText, Users, FlaskConical, LogOut, RefreshCw, Sparkles } from 'lucide-react';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const AdminDashboard = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending' | 'accepted'
  const [pendingItems, setPendingItems] = useState({ materials: [], rooms: [], labs: [], inquiries: [] });
  const [acceptedItems, setAcceptedItems] = useState({ materials: [], rooms: [], labs: [], inquiries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      
      const [pendingRes, acceptedRes] = await Promise.all([
        fetch(`${API_URL}/admin/pending`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/accepted`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const pendingData = await pendingRes.json();
      const acceptedData = await acceptedRes.json();

      if (!pendingRes.ok) throw new Error(pendingData.error || 'Failed to fetch pending');
      if (!acceptedRes.ok) throw new Error(acceptedData.error || 'Failed to fetch accepted');

      setPendingItems({
        materials: pendingData.materials || [],
        rooms: pendingData.rooms || [],
        labs: pendingData.projects || pendingData.labs || [],
        inquiries: pendingData.inquiries || []
      });

      setAcceptedItems({
        materials: acceptedData.materials || [],
        rooms: acceptedData.rooms || [],
        labs: acceptedData.projects || acceptedData.labs || [],
        inquiries: acceptedData.inquiries || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (type, id) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_URL}/admin/approve/${type}/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchData();
  };

  const handleReject = async (type, id) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_URL}/admin/reject/${type}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchData();
  };

  const handleViewMaterial = (item) => {
    if (item.url) {
      const baseUrl = API_URL.replace('/api', '');
      const fullUrl = item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`;
      window.open(fullUrl, '_blank');
    } else if (item.resources && item.resources.length > 0) {
      const baseUrl = API_URL.replace('/api', '');
      const firstRes = item.resources[0];
      const fullUrl = firstRes.url.startsWith('http') ? firstRes.url : `${baseUrl}${firstRes.url}`;
      window.open(fullUrl, '_blank');
    } else {
      alert('No viewable content found for this material.');
    }
  };

  const TAB_TYPE_MAP = { 
    materials: 'material', 
    rooms: 'room', 
    labs: 'project',
    inquiries: 'inquiry' 
  };

  const currentData = statusFilter === 'pending' ? pendingItems : acceptedItems;
  const items = currentData[activeTab] || [];

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
        <div className="admin-header-actions">
          <div className="admin-status-toggle">
            <button 
              className={statusFilter === 'pending' ? 'active' : ''} 
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={statusFilter === 'accepted' ? 'active' : ''} 
              onClick={() => setStatusFilter('accepted')}
            >
              Accepted
            </button>
          </div>
          <button className="admin-refresh-btn" onClick={fetchData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav className="admin-tabs">
        <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>
          <FileText size={18} /> Materials
          <span className="tab-count">{currentData.materials.length}</span>
        </button>
        <button className={activeTab === 'rooms' ? 'active' : ''} onClick={() => setActiveTab('rooms')}>
          <Users size={18} /> Rooms
          <span className="tab-count">{currentData.rooms.length}</span>
        </button>
        <button className={activeTab === 'labs' ? 'active' : ''} onClick={() => setActiveTab('labs')}>
          <FlaskConical size={18} /> Labs
          <span className="tab-count">{currentData.labs.length}</span>
        </button>
        <button className={activeTab === 'inquiries' ? 'active' : ''} onClick={() => setActiveTab('inquiries')}>
          <Sparkles size={18} /> Inquiries
          <span className="tab-count">{currentData.inquiries.length}</span>
        </button>
      </nav>

      {/* ── Content ── */}
      <main className="admin-main">
        {loading && <div className="admin-state-msg">Loading submissions...</div>}
        {error && <div className="admin-state-msg error">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="admin-state-msg">
            <CheckCircle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No {statusFilter} {activeTab} — you're all caught up!</p>
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
                  {item.author?.name && <span>By: {item.author.name}</span>}
                  {item.category && <span>Category: {item.category}</span>}
                  {item.host && <span>Host: {item.host}</span>}
                  <span>Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="admin-card-actions">
                  {activeTab === 'materials' && (
                    <button className="admin-btn view" onClick={() => handleViewMaterial(item)}>
                      <FileText size={16} /> View Content
                    </button>
                  )}
                  {statusFilter === 'pending' && (
                    <button className="admin-btn approve" onClick={() => handleApprove(TAB_TYPE_MAP[activeTab], item._id)}>
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  <button className="admin-btn reject" onClick={() => handleReject(TAB_TYPE_MAP[activeTab], item._id)}>
                    <XCircle size={16} /> {statusFilter === 'accepted' ? 'Remove' : 'Reject'}
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
