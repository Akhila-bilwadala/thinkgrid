import React, { useState, useEffect, useRef } from 'react';
import {
    Send, Upload, BookOpen, File, FileText, Monitor, Brain, Layout,
    Shield, Atom, BarChart, Palette, Book, ExternalLink, X, Download,
    Paperclip, Search, ChevronDown, Bookmark, BookmarkCheck
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

const getIcon = (category) => {
    const key = category?.toLowerCase();
    return ICON_MAP[key] || File;
};

// ── Bot greeting card ─────────────────────────────────────────────
const GREETING_MSG = {
    id: 'greeting',
    role: 'bot',
    type: 'greeting',
    text: null,
};

// ── Single inline material card ───────────────────────────────────
function InlineCard({ m, isSaved, onToggleSave, onView, onUpload }) {
    const CardIcon = getIcon(m.category);
    return (
        <div className="mc-inline-card">
            <div className="mc-inline-top">
                <div className="mc-inline-icon"><CardIcon size={20} /></div>
                <button
                    className={`mc-save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={() => onToggleSave(m._id)}
                >
                    {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    {isSaved ? 'Saved' : 'Save'}
                </button>
            </div>
            <h4 className="mc-inline-title">{m.title}</h4>
            <div className="mc-inline-tags">
                {m.tags?.slice(0, 3).map(t => (
                    <span key={t} className="mc-inline-tag">{t}</span>
                ))}
            </div>
            <div className="mc-inline-actions">
                <button className="mc-btn-upload" onClick={() => onUpload(m)}>
                    <Upload size={13} /> Upload
                </button>
                <button className="mc-btn-view" onClick={() => onView(m)}>
                    <BookOpen size={13} /> View
                </button>
            </div>
        </div>
    );
}

export default function Materials() {
    const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState(new Set());
    const [messages, setMessages] = useState([GREETING_MSG]);
    const [inputValue, setInputValue] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Upload / Create unified modal
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadTarget, setUploadTarget] = useState(null); 
    const [sectionTitle, setSectionTitle] = useState('');
    const [newCategory, setNewCategory] = useState('document');
    const [newInstructor, setNewInstructor] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);

    // Chat with AI state
    const [chatMaterial, setChatMaterial] = useState(null);
    const [activePdfContent, setActivePdfContent] = useState(null); // { text: string, fileName: string }
    const chatPdfRef = useRef(null);

    const [toastMessage, setToastMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);

    const fetchMaterials = async () => {
        try {
            const data = await getMaterials();
            const finalCards = data.filter(m => m && m._id);
            setMaterials(finalCards);
            const saved = new Set();
            finalCards.forEach(m => {
                if (m.savedBy?.some(id => (id._id || id) === user._id)) saved.add(m._id);
            });
            setSavedIds(saved);
            setSelectedMaterial(prev => {
                if (!prev) return null;
                return finalCards.find(m => m._id === prev._id) || prev;
            });
        } catch (err) {
            console.error('Error fetching materials:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMaterials(); }, []);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const addBotMessage = (type, payload, delay = 600) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), role: 'bot', type, ...payload }]);
        }, delay);
    };

    const handleChatPdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsTyping(true);
        addBotMessage('text', { text: `Reading **${file.name}**... Please wait a moment.` });

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/materials/extract-pdf`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to read PDF');

            setActivePdfContent({ fileUri: data.fileUri, fileName: file.name });
            addBotMessage('text', { text: `✅ Read **${file.name}** successfully!\n\nI'm now in PDF mode. Ask me anything about this document, or ask me to **"Summarize"** it.` });
        } catch (err) {
            console.error('PDF Read error:', err);
            addBotMessage('text', { text: `❌ **Error reading file:** ${err.message}. Please make sure it's a valid text-based PDF.` });
        } finally {
            setIsTyping(false);
            e.target.value = null;
        }
    };

    const handleSend = async (query) => {
        const q = (query || inputValue).trim();
        if (!q) return;
        setInputValue('');

        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: q }]);

        // Mode 1: PDF Chat Mode
        if (activePdfContent) {
            setIsTyping(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/materials/ask-pdf`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ fileUri: activePdfContent.fileUri, question: q })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'AI failed to answer');

                addBotMessage('text', { text: data.answer });
            } catch (err) {
                addBotMessage('text', { text: `❌ **AI Error:** ${err.message}` });
            } finally {
                setIsTyping(false);
            }
            return;
        }

        // Mode 2: Standard Search Mode
        const matched = materials.filter(m =>
            m.title.toLowerCase().includes(q.toLowerCase()) ||
            m.tags?.some(t => t.toLowerCase().includes(q.toLowerCase())) ||
            m.category?.toLowerCase().includes(q.toLowerCase()) ||
            m.instructor?.toLowerCase().includes(q.toLowerCase())
        );

        if (matched.length === 0) {
            addBotMessage('text', { text: `I couldn't find any materials matching **"${q}"**. Try browsing all or create a new section using the Upload button.` });
        } else {
            addBotMessage('cards', { text: `Found ${matched.length} resource${matched.length > 1 ? 's' : ''} for **"${q}"**:`, cards: matched });
        }
    };

    const handleBrowseAll = () => {
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: 'Show me all materials' }]);
        addBotMessage('cards', { text: `Here are all ${materials.length} available resources:`, cards: materials });
    };

    const toggleSave = async (id) => {
        const isSaved = savedIds.has(id);
        try {
            if (isSaved) {
                await unsaveMaterial(id);
                setSavedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
            } else {
                await saveMaterial(id);
                setSavedIds(prev => { const next = new Set(prev); next.add(id); return next; });
                showToast('Saved to Activity Hub!');
            }
        } catch (err) { console.error(err); }
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleDownload = (fileUrl, fileName) => {
        if (!fileUrl) return;
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const url = fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
        const a = document.createElement('a');
        a.href = url; a.download = fileName || 'download'; a.target = '_blank';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    // ── Unified Upload Flow ───────────────────────────────────────
    const openUploadModal = (material = null) => {
        setUploadTarget(material);
        setSectionTitle(material ? material.title : '');
        setNewCategory('document');
        setNewInstructor('');
        setUploadFile(null);
        setShowUploadModal(true);
    };

    const handleFilePickChange = (e) => {
        setUploadFile(e.target.files[0] || null);
    };

    const handleUploadSubmit = async () => {
        if (!sectionTitle.trim()) return showToast('Please select or enter a section title.');
        setUploadingFile(true);
        try {
            const formData = new FormData();
            if (uploadFile) {
                formData.append('file', uploadFile);
            }
            formData.append('title', sectionTitle);

            // Check if section exists
            const existingSection = materials.find(m => m.title.toLowerCase() === sectionTitle.toLowerCase());
            
            if (existingSection) {
                formData.append('category', existingSection.category);
                formData.append('tags', JSON.stringify(existingSection.tags));
                if (!uploadFile) {
                    showToast('Section already exists. Please select a file to upload.');
                    setUploadingFile(false);
                    return;
                }
            } else {
                formData.append('category', newCategory);
                formData.append('instructor', newInstructor || 'ThinkGrid');
                formData.append('tags', JSON.stringify(['PPT', 'PDF']));
            }

            await uploadMaterial(formData);
            showToast(uploadFile ? `"${uploadFile.name}" uploaded successfully!` : 'Section created!');
            setShowUploadModal(false);
            await fetchMaterials();
        } catch (err) {
            console.error(err);
            showToast('Failed to save. Try again.');
        } finally {
            setUploadingFile(false);
        }
    };

    const isExistingSection = sectionTitle.trim() && materials.some(m => m.title.toLowerCase() === sectionTitle.toLowerCase().trim());
    const isReadyToSubmit = sectionTitle.trim() && (isExistingSection ? !!uploadFile : true);

    if (loading) return <div className="mat-loading">Loading resources…</div>;

    return (
        <div className="mat-chat-root">

            {/* ── Messages Area ── */}
            <div className="mat-messages">
                {messages.map(msg => {
                    if (msg.id === 'greeting') {
                        return (
                            <div key="greeting" className="mat-greeting">
                                <div className="mat-greeting-icon">
                                    <BookOpen size={28} />
                                </div>
                                <h2 className="mat-greeting-title">Ready when you are.</h2>
                                <p className="mat-greeting-sub">Ask about a topic to find study materials or browse everything.</p>
                                <div className="mat-quick-btns">
                                    <button className="mat-quick-btn" onClick={handleBrowseAll}>Browse all materials</button>
                                    <button className="mat-quick-btn" onClick={() => chatPdfRef.current?.click()}>Chat with notes</button>
                                </div>
                            </div>
                        );
                    }
                    if (msg.role === 'user') {
                        return (
                            <div key={msg.id} className="mat-msg-row user">
                                <div className="mat-bubble user">{msg.text}</div>
                            </div>
                        );
                    }
                    // Bot message
                    return (
                        <div key={msg.id} className="mat-msg-row bot">
                            <div className="mat-bot-avatar"><BookOpen size={16} /></div>
                            <div className="mat-bot-content">
                                {msg.text && (
                                    <p className="mat-bot-text"
                                        dangerouslySetInnerHTML={{
                                            __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }}
                                    />
                                )}
                                {msg.type === 'cards' && (
                                    <div className="mat-cards-grid">
                                        {msg.cards.map(m => (
                                            <InlineCard
                                                key={m._id}
                                                m={m}
                                                isSaved={savedIds.has(m._id)}
                                                onToggleSave={toggleSave}
                                                onView={setSelectedMaterial}
                                                onUpload={openUploadModal}
                                                onChat={m.url?.startsWith('/uploads/') ? () => setChatMaterial(m) : null}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="mat-msg-row bot">
                        <div className="mat-bot-avatar"><BookOpen size={16} /></div>
                        <div className="mat-typing">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── Input Bar ── */}
            <div className="mat-input-bar">
                {activePdfContent && (
                    <div className="mat-pdf-badge-row">
                        <div className="mat-pdf-badge">
                            <FileText size={12} />
                            <span>PDF Mode: {activePdfContent.fileName}</span>
                            <button className="mat-pdf-close" onClick={() => setActivePdfContent(null)}>
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}
                <div className="mat-input-wrap">
                    <input
                        className="mat-input"
                        placeholder={activePdfContent ? `Ask about ${activePdfContent.fileName}...` : "Ask anything…"}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <div className="mat-input-actions">
                        <button className="mat-action-btn" title="Upload" onClick={() => openUploadModal()}>
                            <Paperclip size={16} /> Upload
                        </button>
                        <button
                            className="mat-send-btn"
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── View Resources Modal ── */}
            {selectedMaterial && (
                <div className="mat-modal-overlay" onClick={() => setSelectedMaterial(null)}>
                    <div className="mat-modal" onClick={e => e.stopPropagation()}>
                        <div className="mat-modal-head">
                            <div className="mat-modal-icon">
                                {React.createElement(getIcon(selectedMaterial.category), { size: 28 })}
                            </div>
                            <div>
                                <h2 className="mat-modal-title">{selectedMaterial.title}</h2>
                                <p className="mat-modal-sub">Instructor: {selectedMaterial.instructor || 'Elite Mentor'}</p>
                            </div>
                            <button className="mat-modal-close" onClick={() => setSelectedMaterial(null)}><X size={20} /></button>
                        </div>
                        <div className="mat-modal-body">
                            <h4 className="mat-res-heading">Available Files ({selectedMaterial.resources?.length || 0})</h4>
                            <div className="mat-res-list">
                                {selectedMaterial.resources?.length > 0 ? selectedMaterial.resources.map((res, i) => (
                                    <div key={i} className="mat-res-row">
                                        <div className={`mat-res-type ${res.type?.toLowerCase() || 'pdf'}`}>{res.type || 'PDF'}</div>
                                        <div className="mat-res-info">
                                            <span className="mat-res-name">{res.name}</span>
                                            <span className="mat-res-size">{res.size}</span>
                                        </div>
                                        <button className="mat-res-dl" onClick={() => handleDownload(res.url, res.name)}>
                                            <Download size={16} />
                                        </button>
                                    </div>
                                )) : (
                                    <p className="mat-no-resources">No files uploaded yet. Use the Upload button to add files.</p>
                                )}
                            </div>
                        </div>
                        <div className="mat-modal-foot">
                            <button className="mat-modal-upload-btn" onClick={() => { setSelectedMaterial(null); openUploadModal(selectedMaterial); }}>
                                <Upload size={14} /> Upload File
                            </button>
                            <button className="mat-modal-done" onClick={() => setSelectedMaterial(null)}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Unified Upload Modal ── */}
            {showUploadModal && (
                <div className="mat-modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="mat-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                        <div className="mat-modal-head">
                            <div className="mat-modal-icon" style={{ background: '#F3F4F6', color: '#111827' }}>
                                <Upload size={24} />
                            </div>
                            <div>
                                <h2 className="mat-modal-title">Upload Material</h2>
                                <p className="mat-modal-sub">Add a file or create a new section</p>
                            </div>
                            <button className="mat-modal-close" onClick={() => setShowUploadModal(false)}><X size={20} /></button>
                        </div>
                        <div className="mat-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            
                            {/* Autocomplete Section Input */}
                            <div>
                                <label className="mat-field-label">Section Title</label>
                                <input
                                    className="mat-text-input"
                                    list="material-sections"
                                    placeholder="Type to search or create new…"
                                    value={sectionTitle}
                                    onChange={e => setSectionTitle(e.target.value)}
                                    disabled={!!uploadTarget}
                                />
                                <datalist id="material-sections">
                                    {materials.map(m => (
                                        <option key={m._id} value={m.title} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Additional fields if section is new */}
                            {sectionTitle.trim() && !isExistingSection && (
                                <>
                                    <div style={{ animation: 'fadeUp 0.2s ease' }}>
                                        <label className="mat-field-label">Instructor (optional)</label>
                                        <input
                                            className="mat-text-input"
                                            placeholder="e.g. John Doe, ThinkGrid…"
                                            value={newInstructor}
                                            onChange={e => setNewInstructor(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ animation: 'fadeUp 0.2s ease' }}>
                                        <label className="mat-field-label">Category</label>
                                        <div className="mat-select-wrap">
                                            <select
                                                className="mat-select"
                                                value={newCategory}
                                                onChange={e => setNewCategory(e.target.value)}
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
                                            <ChevronDown size={14} className="mat-select-chevron" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* File picker */}
                            <div>
                                <label className="mat-field-label">
                                    File {(!isExistingSection && sectionTitle.trim()) ? '(optional for new section)' : ''}
                                </label>
                                <div
                                    className="mat-file-drop"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploadFile ? (
                                        <><FileText size={20} /><span>{uploadFile.name}</span></>
                                    ) : (
                                        <><Paperclip size={20} /><span>Click to choose a file (PDF, DOC, PPT…)</span></>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                                    style={{ display: 'none' }}
                                    onChange={handleFilePickChange}
                                />
                            </div>
                        </div>
                        <div className="mat-modal-foot">
                            <button className="mat-modal-cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
                            <button
                                className="mat-modal-done"
                                onClick={handleUploadSubmit}
                                disabled={!isReadyToSubmit || uploadingFile}
                            >
                                {uploadingFile ? 'Uploading…' : (uploadFile ? 'Upload' : 'Create Section')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast ── */}
            {toastMessage && (
                <div className="mat-toast">{toastMessage}</div>
            )}

            {/* ── AI PDF Chat Panel ── */}
            {chatMaterial && (
                <MaterialChat
                    material={chatMaterial}
                    onClose={() => setChatMaterial(null)}
                />
            )}

            {/* Hidden Input for Chat with Notes (legacy, kept for compat) */}
            <input 
                type="file" 
                ref={chatPdfRef} 
                accept=".pdf,.txt" 
                hidden 
                onChange={handleChatPdfUpload} 
            />
        </div>
    );
}
