import React, { useState, useEffect } from 'react';
import {
    Search, Bookmark, BookmarkCheck, Filter, ChevronDown,
    LayoutGrid, List, X, Download, Upload, BookOpen,
    Book, Monitor, Brain, Layout, Shield, Atom, BarChart, Palette, FileText, File, ExternalLink
} from 'lucide-react';
import './Materials.css';
import { getMaterials, saveMaterial, unsaveMaterial, uploadMaterial } from '../api/materials';
import { useAuth } from '../context/AuthContext';

const ICON_MAP = {
    'database': Book,
    'python': Monitor,
    'ml': Brain,
    'system design': Layout,
    'os': Shield,
    'development': Atom,
    'dsa': BarChart,
    'design': Palette,
    'document': FileText,
    'video': Monitor,
    'link': ExternalLink
};

export default function Materials() {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState(new Set());
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const uploadTargetRef = React.useRef(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardCategory, setNewCardCategory] = useState('document');
    const [newCardInstructor, setNewCardInstructor] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const fetchMaterials = async () => {
        try {
            const data = await getMaterials();
            
            // Start with base mock cards
            const MOCK_CARDS = [
                {
                    _id: 'placeholder-1',
                    title: 'Course Syllabus & Notes',
                    category: 'document',
                    instructor: 'ThinkGrid',
                    tags: ['PPT', 'PDF'],
                    points: 0,
                    resources: []
                },
                {
                    _id: 'placeholder-2',
                    title: 'Reference Books',
                    category: 'document',
                    instructor: 'ThinkGrid',
                    tags: ['PPT', 'PDF'],
                    points: 0,
                    resources: []
                }
            ];

            // Group all materials (mocks + fetched) by title so uploads merge into the same card
            const allItems = [...MOCK_CARDS, ...data];
            const groupedMap = new Map();

            allItems.forEach(item => {
                if (!groupedMap.has(item.title)) {
                    // First time seeing this title, create base entry
                    groupedMap.set(item.title, {
                        ...item,
                        resources: [...(item.resources || [])]
                    });
                } else {
                    // Title already exists, merge new resources into it
                    const existing = groupedMap.get(item.title);
                    if (item.resources && item.resources.length > 0) {
                        existing.resources.push(...item.resources);
                    }
                }
            });

            const finalCards = Array.from(groupedMap.values());
            setMaterials(finalCards);
            
            // If a material is currently selected in the modal, update it so resources appear immediately
            setSelectedMaterial(prev => {
                if (!prev) return null;
                return finalCards.find(m => m.title === prev.title) || prev;
            });
        } catch (err) {
            console.error('Error fetching materials:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const filtered = materials.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.instructor?.toLowerCase().includes(query.toLowerCase())
    );

    const toggleSave = async (id) => {
        const isSaved = savedIds.has(id);
        try {
            if (isSaved) {
                await unsaveMaterial(id);
                setSavedIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            } else {
                await saveMaterial(id);
                setSavedIds(prev => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                });
                setToastMessage('Material Saved! Check your Activity Hub.');
                setTimeout(() => setToastMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error toggling material save:', err);
        }
    };

    const closeModal = () => setSelectedMaterial(null);

    const getIcon = (category) => {
        const key = category?.toLowerCase();
        return ICON_MAP[key] || File;
    };

    const fileInputRef = React.useRef(null);

    const handleUploadClick = (materialCard) => {
        uploadTargetRef.current = materialCard;
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const target = uploadTargetRef.current;
        if (file && target) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', target.title);
                formData.append('category', target.category);
                formData.append('tags', JSON.stringify(target.tags));

                await uploadMaterial(formData);
                setToastMessage(`File "${file.name}" uploaded successfully!`);
                setTimeout(() => setToastMessage(''), 1500); // Hide after 1.5 seconds
                await fetchMaterials(); // Refresh materials
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Upload failed. Please try again.');
            } finally {
                uploadTargetRef.current = null;
                e.target.value = null; 
            }
        }
    };

    const handleCreateCard = async () => {
        if (!newCardTitle.trim()) return;
        try {
            await uploadMaterial({ 
                title: newCardTitle, 
                category: newCardCategory, 
                instructor: newCardInstructor || 'ThinkGrid', // Default if empty
                tags: ['PPT', 'PDF'] 
            });
            setNewCardTitle('');
            setNewCardInstructor('');
            setNewCardCategory('document');
            setShowCreateModal(false);
            await fetchMaterials();
        } catch (error) {
            console.error('Failed to create card:', error);
            alert('Failed to create card');
        }
    };

    const handleDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        
        // Convert the relative path to absolute URL if needed
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const url = fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
        
        // Create an invisible anchor tag to trigger the browser download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'download';
        a.target = '_blank'; // Open in new tab in case download attribute isn't supported for cross-origin
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) return <div className="loading-state">Cataloging Elite Resources...</div>;

    return (
        <div className="sp-container">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept=".pdf,.doc,.docx,.txt"
            />

            {/* Toolbar */}
            <div className="sp-toolbar">
                <div className="sp-search-box">
                    <Search size={18} className="sp-search-icon" />
                    <input
                        placeholder="Find courses, materials, topics..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <div className="sp-toolbar-right">
                    <button className="sp-filter-btn" onClick={() => setShowCreateModal(true)}>
                        <span style={{ fontSize: '1.2rem', marginRight: '4px', lineHeight: 1}}>+</span> Create
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="sp-grid">
                {filtered.length > 0 ? filtered.map(m => {
                    const isSaved = savedIds.has(m._id);
                    const CardIcon = getIcon(m.category);
                    return (
                        <div key={m._id} className="sp-card">
                            <div className="sp-card-top">
                                <div className="sp-card-icon"><CardIcon size={24} /></div>
                                <button
                                    className={`sp-save-btn ${isSaved ? 'saved' : ''}`}
                                    onClick={() => toggleSave(m._id)}
                                >
                                    {isSaved ? (
                                        <><span className="save-label">Saved</span><BookmarkCheck size={16} /></>
                                    ) : (
                                        <><span className="save-label">Save</span><Bookmark size={16} /></>
                                    )}
                                </button>
                            </div>

                            <h3 className="sp-card-title">{m.title}</h3>

                            <div className="sp-tags">
                                {m.tags?.map(t => (
                                    <span key={t} className="sp-tag">{t}</span>
                                ))}
                            </div>

                            <div className="sp-card-bottom">
                                <button className="sp-upload-btn" onClick={() => handleUploadClick(m)}>
                                    Upload
                                </button>
                                <button
                                    className="sp-view-btn"
                                    onClick={() => setSelectedMaterial(m)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="no-results">No materials found matching your search.</div>
                )}
            </div>

            {/* Resource Modal */}
            {selectedMaterial && (
                <div className="sp-modal-overlay" onClick={closeModal}>
                    <div className="sp-modal" onClick={e => e.stopPropagation()}>
                        <div className="sp-modal-head">
                            <div className="sp-modal-icon">
                                {React.createElement(getIcon(selectedMaterial.category), { size: 32 })}
                            </div>
                            <div>
                                <h2 className="sp-modal-title">{selectedMaterial.title}</h2>
                                <p className="sp-modal-sub">Instructor: {selectedMaterial.instructor || 'Elite Mentor'}</p>
                            </div>
                            <button className="sp-modal-close" onClick={closeModal}><X size={22} /></button>
                        </div>
                        <div className="sp-modal-body">
                            <h4 className="res-heading">Available Files ({selectedMaterial.resources?.length || 0})</h4>
                            <div className="res-list">
                                {selectedMaterial.resources?.length > 0 ? selectedMaterial.resources.map((res, i) => (
                                    <div key={i} className="res-row">
                                        <div className={`res-type ${res.type?.toLowerCase() || 'pdf'}`}>{res.type || 'PDF'}</div>
                                        <div className="res-info">
                                            <span className="res-name">{res.name}</span>
                                            <span className="res-size">{res.size}</span>
                                        </div>
                                        <button className="res-dl" onClick={() => handleDownload(res.url, res.name)}>
                                            <Download size={18} />
                                        </button>
                                    </div>
                                )) : (
                                    <p className="no-resources">No downloadable files available for this resource.</p>
                                )}
                            </div>
                        </div>
                        <div className="sp-modal-foot">
                            <button className="sp-modal-done" onClick={closeModal}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Card Modal */}
            {showCreateModal && (
                <div className="sp-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="sp-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="sp-modal-head">
                            <h2 className="sp-modal-title">Create Section</h2>
                            <button className="sp-modal-close" onClick={() => setShowCreateModal(false)}><X size={22} /></button>
                        </div>
                        <div className="sp-modal-body" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Section Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. System Design Interview..." 
                                    value={newCardTitle}
                                    onChange={e => setNewCardTitle(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#F9FAFB', color: '#111827', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Instructor Name (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. John Doe, ThinkGrid..." 
                                    value={newCardInstructor}
                                    onChange={e => setNewCardInstructor(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#F9FAFB', color: '#111827', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Category Icon</label>
                                <select 
                                    value={newCardCategory}
                                    onChange={e => setNewCardCategory(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #F1F5F9', background: '#F9FAFB', color: '#111827', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="document">Document</option>
                                    <option value="database">Database</option>
                                    <option value="python">Python</option>
                                    <option value="ml">Machine Learning</option>
                                    <option value="system design">System Design</option>
                                    <option value="os">Operating Systems</option>
                                    <option value="development">Development</option>
                                    <option value="dsa">DSA</option>
                                    <option value="design">Design</option>
                                    <option value="video">Video</option>
                                    <option value="link">Link</option>
                                </select>
                            </div>
                        </div>
                        <div className="sp-modal-foot">
                            <button className="sp-modal-done" onClick={handleCreateCard} style={{ width: '100%' }}>Add Section</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(17, 24, 39, 0.9)', // Dark translucent background
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '99px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    zIndex: 6000,
                    animation: 'auth-rise 0.3s ease both',
                    backdropFilter: 'blur(8px)'
                }}>
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
