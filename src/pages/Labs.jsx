import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Star, GitMerge, Code2, Globe, Database, ChevronRight, X, Github, Mail, User as UserIcon } from 'lucide-react';
import './Labs.css';
import { useAuth } from '../context/AuthContext';
import { getLabs, createLab } from '../api/labs';

const FALLBACK_LABS = [
    {
        _id: 'seed-1',
        title: 'OpenSource LearnHub',
        host: 'Ravi Kumar',
        avatar: '/default-avatar.png',
        description: 'Building a community-driven platform for indexing free coding resources and roadmaps.',
        tags: ['React', 'Node.js', 'MongoDB'],
        status: 'OPEN',
        members: 4,
        maxMembers: 10,
        stars: 128,
        hostEmail: 'ravi.kumar@example.com'
    },
    {
        _id: 'seed-2',
        title: 'CryptoTracker API',
        host: 'Sneha Reddy',
        avatar: '/default-avatar.png',
        description: 'A low-latency GraphQL API wrapper for aggregating real-time crypto prices across exchanges.',
        tags: ['GraphQL', 'Go', 'Redis'],
        status: 'CLOSED',
        members: 3,
        maxMembers: 3,
        stars: 45,
        repoUrl: 'https://github.com/SnehaReddy/cryptotracker-api',
        hostEmail: 'sneha.reddy@example.com'
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
    const [loading, setLoading] = useState(true);
    const [showHostModal, setShowHostModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        repoUrl: '',
        maxMembers: 5,
        tags: '',
        recruitDeadline: '', // ✅ New field
        host: user?.name || '',
        hostEmail: user?.email || ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                host: prev.host || user.name || '',
                hostEmail: prev.hostEmail || user.email || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        fetchLabs();
    }, []);

    const fetchLabs = async () => {
        try {
            const data = await getLabs();
            setLabs(data.length > 0 ? data : FALLBACK_LABS);
        } catch (err) {
            console.error('Error fetching labs:', err);
            setLabs(FALLBACK_LABS);
        } finally {
            setLoading(false);
        }
    };

    const handleHostSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
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
                hostEmail: user?.email || ''
            });
            fetchLabs();
        } catch (err) {
            console.error('Error hosting project:', err);
            alert('Failed to host project. Please check all fields.');
        }
    };

    const handleActionClick = (lab) => {
        if (lab.status === 'OPEN') {
            const subject = encodeURIComponent(`Request to join project: ${lab.title}`);
            const body = encodeURIComponent(
                `Hi ${lab.host},\n\nI would like to join your project "${lab.title}" on ThinkGrid.\n\nMy Portfolio: ${user?.portfolioUrl || 'Not specified'}\n\nBest regards,\n${user?.name || 'A ThinkGrid User'}`
            );
            window.location.href = `mailto:${lab.hostEmail}?subject=${subject}&body=${body}`;
        } else if (lab.status === 'CLOSED' && lab.repoUrl) {
            window.open(lab.repoUrl, '_blank');
        }
    };

    const filteredLabs = labs.filter(lab => {
        const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lab.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'ALL' ? true : lab.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="labs-container">
            {/* Header */}
            <div className="labs-header">
                <div className="labs-header-content">
                    <h1>Active Labs</h1>
                    <p>Join live projects hosted by peers, contribute code, and build your portfolio.</p>
                </div>
                <button className="labs-create-btn" onClick={() => setShowHostModal(true)}>
                    <Plus size={18} />
                    Host Project
                </button>
            </div>

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

                <div className="labs-filters">
                    {['ALL', 'OPEN', 'CLOSED'].map(f => (
                        <button
                            key={f}
                            className={`labs-filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'ALL' ? 'All Projects' : f === 'OPEN' ? 'Accepting Contributors' : 'Team Full'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="labs-grid">
                {filteredLabs.map(lab => (
                    <div key={lab._id || lab.id} className="lab-card">
                        <div className="lab-card-header">
                            <div className="lab-icon-box"><TagIcon tags={lab.tags} /></div>
                            <div className={`lab-status ${lab.status.toLowerCase()}`}>
                                {lab.status === 'OPEN' ? '● Open to Join' : 'Closed'}
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
                                <img src={lab.avatar} alt={lab.host} className="lab-host-avatar" />
                                <div>
                                    <span className="lab-hosted-by">Hosted by</span>
                                    <span className="lab-host-name">{lab.host}</span>
                                </div>
                            </div>

                            <div className="lab-metrics">
                                <div className="lab-metric" title="Contributors">
                                    <Users size={14} />
                                    <span>{lab.members}/{lab.maxMembers}</span>
                                </div>
                                <div className="lab-metric" title="Stars">
                                    <Star size={14} />
                                    <span>{lab.stars}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button 
                            className={`lab-join-btn ${lab.status.toLowerCase()}`}
                            onClick={() => handleActionClick(lab)}
                        >
                            {lab.status === 'OPEN' ? 'Join Project' : 'View Repository'}
                            <ChevronRight size={16} />
                        </button>
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
