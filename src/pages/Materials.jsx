import React, { useState } from 'react';
import {
    Search,
    MoreHorizontal,
    BookOpen,
    Clock,
    CheckCircle2,
    Filter,
    ChevronDown,
    LayoutGrid,
    List,
    X,
    Download,
    Upload,
    Tag,
    BarChart
} from 'lucide-react';
import './Materials.css';

const MATERIALS = [
    {
        id: 1,
        icon: '📚',
        title: 'Advanced DBMS & SQL Masterclass',
        instructor: 'Dr. Sarah Venn',
        avatar: '👩‍🏫',
        lessons: 24,
        hours: 12,
        progress: 100,
        category: 'DBMS',
        difficulty: 'Intermediate',
        gradient: 'linear-gradient(135deg, #FF3E6C 0%, #FFD080 100%)',
        resources: [
            { name: 'Introduction to SQL.pdf', type: 'PDF', size: '2.4 MB' },
            { name: 'Indexing & Optimization.ppt', type: 'PPT', size: '4.1 MB' },
            { name: 'Normalization Guide.pdf', type: 'PDF', size: '1.2 MB' }
        ]
    },
    {
        id: 2,
        icon: '💻',
        title: 'Python for Data Science 101',
        instructor: 'Ravi Kumar',
        avatar: '🧑‍💻',
        lessons: 18,
        hours: 8,
        progress: 100,
        category: 'Python',
        difficulty: 'Beginner',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        resources: [
            { name: 'NumPy Essentials.pdf', type: 'PDF', size: '1.8 MB' },
            { name: 'Pandas DataFrames.docx', type: 'DOC', size: '920 KB' },
            { name: 'Data Visualization Sketch.pdf', type: 'PDF', size: '3.5 MB' }
        ]
    },
    {
        id: 3,
        icon: '🧠',
        title: 'Machine Learning Fundamentals',
        instructor: 'Sneha Reddy',
        avatar: '👩‍💻',
        lessons: 32,
        hours: 20,
        progress: 35,
        category: 'ML',
        difficulty: 'Advanced',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        resources: [
            { name: 'Linear Regression.pdf', type: 'PDF', size: '2.1 MB' },
            { name: 'Neural Networks 101.ppt', type: 'PPT', size: '8.4 MB' }
        ]
    },
    {
        id: 4,
        icon: '🏗️',
        title: 'System Design Interview Prep',
        instructor: 'Dr. Sarah Venn',
        avatar: '👩‍🏫',
        lessons: 15,
        hours: 10,
        progress: 25,
        category: 'System Design',
        difficulty: 'Advanced',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        resources: [
            { name: 'Load Balancing Basics.pdf', type: 'PDF', size: '1.1 MB' },
            { name: 'Microservices Architecture.docx', type: 'DOC', size: '2.6 MB' },
            { name: 'Caching Strategies.pdf', type: 'PDF', size: '1.5 MB' }
        ]
    },
    {
        id: 5,
        icon: '🛡️',
        title: 'Operating Systems - OS Deep Dive',
        instructor: 'James Wilson',
        avatar: '👨‍🏫',
        lessons: 20,
        hours: 15,
        progress: 74,
        category: 'OS',
        difficulty: 'Intermediate',
        gradient: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        resources: [
            { name: 'Process Scheduling.pdf', type: 'PDF', size: '3.2 MB' },
            { name: 'Memory Management.ppt', type: 'PPT', size: '5.6 MB' }
        ]
    },
    {
        id: 6,
        icon: '⚛️',
        title: 'React & Frontend Architecture',
        instructor: 'Kevin D\'Souza',
        avatar: '👨‍💻',
        lessons: 28,
        hours: 14,
        progress: 60,
        category: 'Development',
        difficulty: 'Intermediate',
        gradient: 'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
        resources: [
            { name: 'React Hooks Guide.pdf', type: 'PDF', size: '1.2 MB' },
            { name: 'Redux vs Context.docx', type: 'DOC', size: '840 KB' }
        ]
    },
    {
        id: 7,
        icon: '📊',
        title: 'Data Structures & Algorithms',
        instructor: 'Arjun Singh',
        avatar: '🧑‍🎓',
        lessons: 45,
        hours: 30,
        progress: 34,
        category: 'DSA',
        difficulty: 'Intermediate',
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        resources: [
            { name: 'Tree Traversal.pdf', type: 'PDF', size: '2.8 MB' },
            { name: 'Graph Algorithms.ppt', type: 'PPT', size: '6.1 MB' }
        ]
    },
    {
        id: 8,
        icon: '🎨',
        title: 'UI/UX Design for Engineers',
        instructor: 'Priya Sharma',
        avatar: '👩‍🎓',
        lessons: 12,
        hours: 5,
        progress: 25,
        category: 'Design',
        difficulty: 'Beginner',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        resources: [
            { name: 'Typography for Web.pdf', type: 'PDF', size: '5.4 MB' },
            { name: 'Color Psychology.pdf', type: 'PDF', size: '3.1 MB' }
        ]
    }
];

export default function Materials() {
    const [view, setView] = useState('grid');
    const [query, setQuery] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const filtered = MATERIALS.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.instructor.toLowerCase().includes(query.toLowerCase())
    );

    const closeModal = () => setSelectedMaterial(null);

    return (
        <div className="materials-hub-container">
            {/* Top Toolbar */}
            <div className="materials-toolbar">
                <div className="toolbar-left">
                    <div className="mat-search-wrapper">
                        <Search size={18} className="mat-search-icon" />
                        <input
                            placeholder="Find study materials, notes, courses..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="toolbar-right">
                    <button className="toolbar-btn"><Filter size={18} /></button>
                    <div className="sort-dropdown">
                        <span>Sort by: <b>All Categories</b></span>
                        <ChevronDown size={16} />
                    </div>
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
                            onClick={() => setView('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className={`materials-grid ${view}`}>
                {filtered.map(m => (
                    <div key={m.id} className="material-card-glass">
                        <div className="mat-card-header">
                            <div className="mat-type-icon" style={{ background: m.gradient }}>
                                {m.icon}
                            </div>
                            <button className="mat-more-btn"><MoreHorizontal size={18} /></button>
                        </div>

                        <div className="mat-card-body">
                            <h3 className="mat-card-title">{m.title}</h3>

                            <div className="mat-badge-row">
                                <div className="mat-badge category">
                                    <Tag size={12} />
                                    <span>{m.category}</span>
                                </div>
                                <div className={`mat-badge difficulty ${m.difficulty.toLowerCase()}`}>
                                    <BarChart size={12} />
                                    <span>{m.difficulty}</span>
                                </div>
                            </div>

                            <div className="mat-stats-row">
                                <div className="mat-stat">
                                    <BookOpen size={14} />
                                    <span>{m.resources.length} Total Materials</span>
                                </div>
                            </div>
                        </div>

                        <div className="mat-card-footer">
                            <button
                                className="mat-download-btn"
                                onClick={() => setSelectedMaterial(m)}
                            >
                                <BookOpen size={16} />
                                <span>View Resources</span>
                            </button>
                            <button className="mat-upload-btn">
                                <Upload size={16} />
                                <span>Upload</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resource Modal */}
            {selectedMaterial && (
                <div className="mat-modal-overlay" onClick={closeModal}>
                    <div className="mat-modal-glass" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-row">
                                <div className="modal-icon" style={{ background: selectedMaterial.gradient }}>
                                    {selectedMaterial.icon}
                                </div>
                                <div>
                                    <h2 className="modal-main-title">{selectedMaterial.title}</h2>
                                    <p className="modal-subtitle">Instructor: {selectedMaterial.instructor}</p>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}><X size={24} /></button>
                        </div>

                        <div className="modal-body">
                            <h4 className="resources-label">Available Files ({selectedMaterial.resources.length})</h4>
                            <div className="resources-list">
                                {selectedMaterial.resources.map((res, i) => (
                                    <div key={i} className="resource-item-glass">
                                        <div className="res-file-info">
                                            <div className={`file-type-badge ${res.type.toLowerCase()}`}>
                                                {res.type}
                                            </div>
                                            <div className="res-name-block">
                                                <span className="res-name">{res.name}</span>
                                                <span className="res-size">{res.size}</span>
                                            </div>
                                        </div>
                                        <button className="res-download-icon-btn">
                                            <Download size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-primary-btn" onClick={closeModal}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
