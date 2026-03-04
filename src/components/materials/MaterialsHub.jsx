import React from 'react';
import { Search, FileText, Download, Star, Filter, Folder, ExternalLink } from 'lucide-react';
import './MaterialsHub.css';

const MOCK_MATERIALS = [
    { id: 1, title: 'BCNF vs 3NF Deep Dive', category: 'DBMS', type: 'PDF', size: '2.4 MB', rating: 4.9, author: 'Dr. Sarah Venn' },
    { id: 2, title: 'Operating Systems - Process Scheduling', category: 'OS', type: 'Handwritten Notes', size: '12 MB', rating: 4.8, author: 'James Wilson' },
    { id: 3, title: 'Computer Networks - OSI Model', category: 'CN', type: 'Cheat Sheet', size: '1.1 MB', rating: 4.7, author: 'Alex Smith' },
    { id: 4, title: 'Data Structures - Tree Visualizations', category: 'DSA', type: 'Presentation', size: '4.5 MB', rating: 4.9, author: 'Prof. Miller' },
    { id: 5, title: 'Assembly Language Basics', category: 'COA', type: 'PDF', size: '850 KB', rating: 4.5, author: 'Senior Alumni' },
    { id: 6, title: 'Quantum Computing Intro', category: 'Physics', type: 'Link', size: 'Web', rating: 4.9, author: 'Research Lab' },
];

const MaterialsHub = () => {
    return (
        <div className="materials-hub animate-fade">
            <header className="materials-header">
                <div className="header-text-v2">
                    <h2 className="gradient-text">Academic Library</h2>
                    <p>Verified study materials, previous year papers, and community notes.</p>
                </div>
                <div className="materials-search glass">
                    <Search size={20} />
                    <input type="text" placeholder="Search for subjects, topics, or professors..." />
                </div>
            </header>

            <div className="materials-filter-bar">
                <div className="folder-tabs">
                    <button className="folder-tab active"><Folder size={16} /> All Materials</button>
                    <button className="folder-tab"><Folder size={16} /> My Downloads</button>
                    <button className="folder-tab"><Folder size={16} /> Contributions</button>
                </div>
                <button className="filter-btn glass"><Filter size={16} /> Filter</button>
            </div>

            <div className="materials-grid">
                {MOCK_MATERIALS.map(item => (
                    <div key={item.id} className="material-card premium-card">
                        <div className="material-type-icon">
                            {item.type === 'PDF' && <FileText size={24} className="icon-red" />}
                            {item.type === 'Link' && <ExternalLink size={24} className="icon-blue" />}
                            {item.type !== 'PDF' && item.type !== 'Link' && <FileText size={24} className="icon-purple" />}
                        </div>
                        <div className="material-details">
                            <span className="material-category">{item.category}</span>
                            <h3 className="material-title">{item.title}</h3>
                            <div className="material-meta">
                                <span className="author">by {item.author}</span>
                                <span className="dot">•</span>
                                <span className="rating"><Star size={12} className="star-icon" /> {item.rating}</span>
                            </div>
                        </div>
                        <div className="material-footer">
                            <span className="file-info">{item.type} • {item.size}</span>
                            <button className="download-btn">
                                <Download size={16} />
                                <span>Get</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <section className="contribute-banner glass">
                <div className="banner-content">
                    <h3>Missing something?</h3>
                    <p>Upload your verified notes and earn **Knowledge XP**.</p>
                    <button className="upload-cta">Upload Now</button>
                </div>
            </section>
        </div>
    );
};

export default MaterialsHub;
