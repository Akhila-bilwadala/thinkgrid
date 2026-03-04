import React, { useState } from 'react';
import {
    Search, Bookmark, BookmarkCheck, Filter, ChevronDown,
    LayoutGrid, List, X, Download, Upload, BookOpen
} from 'lucide-react';
import './Materials.css';

const MATERIALS = [
    {
        id: 1, icon: '📚', title: 'Advanced DBMS & SQL Masterclass',
        instructor: 'Dr. Sarah Venn', timeAgo: '5 days ago',
        tags: ['Database', 'Intermediate'], points: '120 pts',
        category: 'DBMS',
        resources: [
            { name: 'Introduction to SQL.pdf', type: 'PDF', size: '2.4 MB' },
            { name: 'Indexing & Optimization.ppt', type: 'PPT', size: '4.1 MB' },
            { name: 'Normalization Guide.pdf', type: 'PDF', size: '1.2 MB' }
        ]
    },
    {
        id: 2, icon: '💻', title: 'Python for Data Science 101',
        instructor: 'Ravi Kumar', timeAgo: '12 days ago',
        tags: ['Python', 'Beginner'], points: '80 pts',
        category: 'Python',
        resources: [
            { name: 'NumPy Essentials.pdf', type: 'PDF', size: '1.8 MB' },
            { name: 'Pandas DataFrames.docx', type: 'DOC', size: '920 KB' },
            { name: 'Data Visualization Sketch.pdf', type: 'PDF', size: '3.5 MB' }
        ]
    },
    {
        id: 3, icon: '🧠', title: 'Machine Learning Fundamentals',
        instructor: 'Sneha Reddy', timeAgo: '3 days ago',
        tags: ['AI/ML', 'Advanced'], points: '200 pts',
        category: 'ML',
        resources: [
            { name: 'Linear Regression.pdf', type: 'PDF', size: '2.1 MB' },
            { name: 'Neural Networks 101.ppt', type: 'PPT', size: '8.4 MB' }
        ]
    },
    {
        id: 4, icon: '🏗️', title: 'System Design Interview Prep',
        instructor: 'Dr. Sarah Venn', timeAgo: '1 week ago',
        tags: ['Architecture', 'Advanced'], points: '150 pts',
        category: 'System Design',
        resources: [
            { name: 'Load Balancing Basics.pdf', type: 'PDF', size: '1.1 MB' },
            { name: 'Microservices Architecture.docx', type: 'DOC', size: '2.6 MB' },
            { name: 'Caching Strategies.pdf', type: 'PDF', size: '1.5 MB' }
        ]
    },
    {
        id: 5, icon: '🛡️', title: 'Operating Systems - OS Deep Dive',
        instructor: 'James Wilson', timeAgo: '30 days ago',
        tags: ['OS', 'Intermediate'], points: '100 pts',
        category: 'OS',
        resources: [
            { name: 'Process Scheduling.pdf', type: 'PDF', size: '3.2 MB' },
            { name: 'Memory Management.ppt', type: 'PPT', size: '5.6 MB' }
        ]
    },
    {
        id: 6, icon: '⚛️', title: 'React & Frontend Architecture',
        instructor: "Kevin D'Souza", timeAgo: '2 days ago',
        tags: ['React', 'Intermediate'], points: '90 pts',
        category: 'Development',
        resources: [
            { name: 'React Hooks Guide.pdf', type: 'PDF', size: '1.2 MB' },
            { name: 'Redux vs Context.docx', type: 'DOC', size: '840 KB' }
        ]
    },
    {
        id: 7, icon: '📊', title: 'Data Structures & Algorithms',
        instructor: 'Arjun Singh', timeAgo: '18 days ago',
        tags: ['Core', 'Intermediate'], points: '130 pts',
        category: 'DSA',
        resources: [
            { name: 'Tree Traversal.pdf', type: 'PDF', size: '2.8 MB' },
            { name: 'Graph Algorithms.ppt', type: 'PPT', size: '6.1 MB' }
        ]
    },
    {
        id: 8, icon: '🎨', title: 'UI/UX Design for Engineers',
        instructor: 'Priya Sharma', timeAgo: '8 days ago',
        tags: ['Design', 'Beginner'], points: '60 pts',
        category: 'Design',
        resources: [
            { name: 'Typography for Web.pdf', type: 'PDF', size: '5.4 MB' },
            { name: 'Color Psychology.pdf', type: 'PDF', size: '3.1 MB' }
        ]
    }
];

export default function Materials() {
    const [query, setQuery] = useState('');
    const [savedIds, setSavedIds] = useState(new Set([2]));
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const filtered = MATERIALS.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.instructor.toLowerCase().includes(query.toLowerCase())
    );

    const toggleSave = (id) => {
        setSavedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const closeModal = () => setSelectedMaterial(null);

    return (
        <div className="sp-container">
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
                    <button className="sp-filter-btn"><Filter size={16} /> Filter</button>
                    <div className="sp-sort">
                        <span>Sort: <strong>All</strong></span>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="sp-grid">
                {filtered.map(m => {
                    const isSaved = savedIds.has(m.id);
                    return (
                        <div key={m.id} className="sp-card">
                            {/* Top Row: icon + save */}
                            <div className="sp-card-top">
                                <div className="sp-card-icon">{m.icon}</div>
                                <button
                                    className={`sp-save-btn ${isSaved ? 'saved' : ''}`}
                                    onClick={() => toggleSave(m.id)}
                                >
                                    {isSaved ? (
                                        <><span className="save-label">Saved</span><BookmarkCheck size={16} /></>
                                    ) : (
                                        <><span className="save-label">Save</span><Bookmark size={16} /></>
                                    )}
                                </button>
                            </div>

                            {/* Title */}
                            <h3 className="sp-card-title">{m.title}</h3>

                            {/* Tags */}
                            <div className="sp-tags">
                                {m.tags.map(t => (
                                    <span key={t} className="sp-tag">{t}</span>
                                ))}
                            </div>

                            {/* Bottom Row: action buttons */}
                            <div className="sp-card-bottom">
                                <button className="sp-upload-btn">
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
                })}
            </div>

            {/* Resource Modal */}
            {selectedMaterial && (
                <div className="sp-modal-overlay" onClick={closeModal}>
                    <div className="sp-modal" onClick={e => e.stopPropagation()}>
                        <div className="sp-modal-head">
                            <div className="sp-modal-icon">{selectedMaterial.icon}</div>
                            <div>
                                <h2 className="sp-modal-title">{selectedMaterial.title}</h2>
                                <p className="sp-modal-sub">Instructor: {selectedMaterial.instructor}</p>
                            </div>
                            <button className="sp-modal-close" onClick={closeModal}><X size={22} /></button>
                        </div>
                        <div className="sp-modal-body">
                            <h4 className="res-heading">Available Files ({selectedMaterial.resources.length})</h4>
                            <div className="res-list">
                                {selectedMaterial.resources.map((res, i) => (
                                    <div key={i} className="res-row">
                                        <div className={`res-type ${res.type.toLowerCase()}`}>{res.type}</div>
                                        <div className="res-info">
                                            <span className="res-name">{res.name}</span>
                                            <span className="res-size">{res.size}</span>
                                        </div>
                                        <button className="res-dl"><Download size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="sp-modal-foot">
                            <button className="sp-modal-done" onClick={closeModal}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
