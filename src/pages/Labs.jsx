import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Star, GitMerge, Code2, Globe, Database, ChevronRight, X, Github, Mail, User as UserIcon } from 'lucide-react';
import './Labs.css';
import { useAuth } from '../context/AuthContext';
import { getLabs, createLab, joinLab, getMyLabs } from '../api/labs';

const FALLBACK_LABS = [
    {
        _id: 'seed-1',
        title: 'OpenSource LearnHub',
        host: 'Ravi Kumar',
        avatar: '/default-avatar.png',
        description: 'Building a community-driven platform for indexing free coding resources and roadmaps.',
        tags: ['React', 'Node.js', 'MongoDB'],
        status: 'OPEN',
        members: [],
        maxMembers: 10,
        stars: 128,
        hostEmail: 'ravi.kumar@example.com'
    }
];

const TagIcon = ({ tags }) => {
    if (tags.some(t => t.toLowerCase().includes('react'))) return <Globe size={24} />;
    if (tags.some(t => t.toLowerCase().includes('python'))) return <GitMerge size={24} />;
    if (tags.some(t => t.toLowerCase().includes('data'))) return <Database size={24} />;
    return <Code2 size={24} />;
};

export default function Labs() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, OPEN, CLOSED
    const [labs, setLabs] = useState([]);
    const [myLabs, setMyLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHostModal, setShowHostModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        repoUrl: '',
        maxMembers: 5,
        tags: '',
        recruitDeadline: '', 
        host: user?.name || '',
        hostEmail: user?.email || '',
        avatar: user?.picture || ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                host: prev.host || user.name || '',
                hostEmail: prev.hostEmail || user.email || '',
                avatar: prev.avatar || user.picture || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        fetchLabs();
    }, []);

    const fetchLabs = async () => {
        try {
            const [data, userLabs] = await Promise.all([getLabs(), getMyLabs()]);
            setLabs(data.length > 0 ? data : FALLBACK_LABS);
            setMyLabs(userLabs);
        } catch (err) {
            console.error('Error fetching labs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleHostSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                avatar: formData.avatar || '/default-avatar.png',
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };
            await createLab(payload);
            setShowHostModal(false);
            setFormData({
                title: '',
                description: '',
                repoUrl: '',
                maxMembers: 5,
                tags: '',
                recruitDeadline: '',
                host: user?.name || '',
                hostEmail: user?.email || '',
                avatar: user?.picture || ''
            });
            fetchLabs();
            alert('Project hosted! Waiting for admin approval. View progress in Activity -> Projects.');
        } catch (err) {
            console.error('Error hosting project:', err);
            alert('Failed to host project. Please check all fields.');
        }
    };

    const handleActionClick = async (lab) => {
        const isMember = lab.members?.some(m => (m._id || m) === user._id);
        const isPending = lab.pendingMembers?.some(m => (m._id || m) === user._id);

        if (isMember) {
            window.location.href = '/activity'; // Go to activity to see details
            return;
        }

        if (isPending) {
            alert('Your request is still pending host approval.');
            return;
        }

        try {
            await joinLab(lab._id);
            alert('Join request sent to the host!');
            fetchLabs();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to join project.';
            alert(msg);
        }
    };

    const filteredLabs = labs.filter(lab => {
        const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lab.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const isFull = lab.members?.length >= lab.maxMembers;
        const status = isFull ? 'CLOSED' : 'OPEN';
        
        const matchesFilter = filter === 'ALL' ? true : status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="labs-container">
            {/* Toolbar */}
            <div className="labs-toolbar">
                <div className="labs-search">
                    <Search size={18} />
                    <input
                        placeholder="Search projects by name or tools..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="labs-toolbar-right">
                    <div className="labs-filters">
                        {['ALL', 'OPEN', 'CLOSED'].map(f => (
                            <button
                                key={f}
                                className={`labs-filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'ALL' ? 'All' : f === 'OPEN' ? 'Accepting' : 'Full'}
                            </button>
                        ))}
                    </div>
                    
                    <button className="labs-create-btn" onClick={() => setShowHostModal(true)}>
                        <Plus size={16} />
                        Host Project
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="labs-grid">
                {filteredLabs.map(lab => (
                    <div key={lab._id || lab.id} className="lab-card">
                        <div className="lab-card-header">
                            <div className="lab-icon-box"><TagIcon tags={lab.tags} /></div>
                            <div className={`lab-status ${(lab.members?.length >= lab.maxMembers) ? 'closed' : 'open'}`}>
                                {lab.members?.length >= lab.maxMembers ? '● Full' : '● Open to Join'}
                            </div>
                        </div>

                        <div className="lab-card-body">
                            <h3 className="lab-title">{lab.title}</h3>
                            <p className="lab-desc">{lab.description}</p>

                            <div className="lab-tags">
                                {lab.tags.map(tag => (
                                    <span key={tag} className="lab-tag">{tag}</span>
                                ))}
                            </div>

                            {lab.recruitDeadline && (
                                <div className="lab-deadline-row">
                                    <Star size={14} color="#7C3AED" />
                                    <span>Recruitment Ends: {new Date(lab.recruitDeadline).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="lab-card-footer">
                            <div className="lab-host-info">
                                <img src={(lab.hostEmail === user?.email && user?.picture) ? user.picture : (lab.avatar && lab.avatar !== '/default-avatar.png' ? lab.avatar : '/default-avatar.png')} alt={lab.host} className="lab-host-avatar" />
                                <div>
                                    <span className="lab-hosted-by">Hosted by</span>
                                    <span className="lab-host-name">{lab.host}</span>
                                </div>
                            </div>

                            <div className="lab-metrics">
                                <div className="lab-metric" title="Contributors">
                                    <Users size={14} />
                                    <span>{lab.members?.length || 0}/{lab.maxMembers}</span>
                                </div>
                                <div className="lab-metric" title="Stars">
                                    <Star size={14} />
                                    <span>{lab.stars}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        {(() => {
                            const isMember = lab.members?.some(m => (m._id || m) === user._id);
                            const isPending = lab.pendingMembers?.some(m => (m._id || m) === user._id);
                            const isFull = lab.members?.length >= lab.maxMembers;

                            return (
                                <button 
                                    className={`lab-join-btn ${isFull && !isMember ? 'closed' : 'open'}`}
                                    onClick={() => handleActionClick(lab)}
                                    disabled={isFull && !isMember && !isPending}
                                >
                                    {isMember ? (
                                        <>ENTER PROJECT <ChevronRight size={16} /></>
                                    ) : isPending ? (
                                        <>PENDING APPROVAL</>
                                    ) : isFull ? (
                                        <>PROJECT FULL</>
                                    ) : (
                                        <><span className="btn-dot">●</span> JOIN</>
                                    )}
                                </button>
                            );
                        })()}
                    </div>
                ))}
            </div>

            {/* Host Project Modal */}
            {showHostModal && (
                <div className="labs-modal-overlay">
                    <div className="labs-modal-card animate-up">
                        <div className="labs-modal-header">
                            <h2>Host New Project</h2>
                            <button className="close-modal-btn" onClick={() => setShowHostModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form className="labs-modal-form" onSubmit={handleHostSubmit}>
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Project Name</label>
                                    <input 
                                        required
                                        placeholder="e.g. OpenSource LearnHub"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="form-group full">
                                    <label>Description</label>
                                    <textarea 
                                        required
                                        placeholder="Briefly describe what your project does..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GitHub Repository URL</label>
                                    <div className="input-with-icon">
                                        <Github size={16} />
                                        <input 
                                            placeholder="https://github.com/..."
                                            value={formData.repoUrl}
                                            onChange={e => setFormData({...formData, repoUrl: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Total Members Needed</label>
                                    <div className="input-with-icon">
                                        <Users size={16} />
                                        <input 
                                            type="number"
                                            min="1"
                                            value={formData.maxMembers}
                                            onChange={e => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group full">
                                    <label>Tech Stack (comma separated)</label>
                                    <div className="input-with-icon">
                                        <Code2 size={16} />
                                        <input 
                                            placeholder="React, Node.js, MongoDB"
                                            value={formData.tags}
                                            onChange={e => setFormData({...formData, tags: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group full">
                                    <label>Inviting People End Date</label>
                                    <input 
                                        type="date"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                        value={formData.recruitDeadline}
                                        onChange={e => setFormData({...formData, recruitDeadline: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Host Name</label>
                                    <div className="input-with-icon">
                                        <UserIcon size={16} />
                                        <input 
                                            required
                                            value={formData.host}
                                            onChange={e => setFormData({...formData, host: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Host Email (for requests)</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} />
                                        <input 
                                            required
                                            type="email"
                                            value={formData.hostEmail}
                                            onChange={e => setFormData({...formData, hostEmail: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowHostModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Launch Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
