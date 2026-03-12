import React, { useState, useEffect } from 'react';
import { History, Briefcase, RefreshCw, MessageSquare, ArrowRight, Zap, Star, ExternalLink } from 'lucide-react';
import './Activity.css';
import { getRooms } from '../api/rooms';
import { getMaterials } from '../api/materials';
import { useAuth } from '../context/AuthContext';

export default function Activity({ onEnterRoom }) {
    const { user } = useAuth();
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [savedMaterials, setSavedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const [rooms, materials] = await Promise.all([
                    getRooms(),
                    getMaterials()
                ]);
                
                setJoinedRooms(rooms.filter(r => 
                    r.members?.some(m => (m._id || m) === user._id)
                ));
                setSavedMaterials(materials.filter(m => m.savedBy?.some(id => (id._id || id) === user._id)));
            } catch (err) {
                console.error('Error fetching activity:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [user._id]);

    if (loading) return <div className="loading-state">Syncing your Elite history...</div>;

    return (
        <div className="activity-page animate-up">
            <header className="activity-header">
                <div className="header-text">
                    <h1>Your Activity</h1>
                    <p>Track your contributions, learning progress, and community engagement.</p>
                </div>
            </header>

            <div className="activity-grid">
                {/* ── PROJECTS SECTION (Static for now) ── */}
                <section className="activity-section">
                    <div className="section-header">
                        <div className="section-title-wrap">
                            <Briefcase className="section-icon" size={20} />
                            <h2>Joined Projects</h2>
                        </div>
                        <button className="btn-view-all">See all</button>
                    </div>

                    <div className="project-list">
                        <div className="project-card-item card">
                            <div className="project-info">
                                <div className="project-main">
                                    <h3 className="project-title">ThinkGrid Web App</h3>
                                    <span className="project-role">Frontend Lead</span>
                                </div>
                                <div className="project-status-badge" data-status="in-progress">
                                    In Progress
                                </div>
                            </div>
                            <div className="project-progress-wrap">
                                <div className="progress-label">
                                    <span>Completion</span>
                                    <span>75%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: '75%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SAVED MATERIALS SECTION ── */}
                <section className="activity-section">
                    <div className="section-header">
                        <div className="section-title-wrap">
                            <Star className="section-icon" size={20} />
                            <h2>Saved Materials</h2>
                        </div>
                        <button className="btn-view-all">See All</button>
                    </div>

                    <div className="skill-exchange-list">
                        {savedMaterials.length > 0 ? savedMaterials.map(item => (
                            <div key={item._id} className="skill-exchange-card card">
                                <div className="skill-card-left">
                                    <div className="skill-type-tag learning">
                                        <Zap size={12} />
                                        {item.category || 'General'}
                                    </div>
                                    <h3 className="skill-name">{item.title}</h3>
                                    <p className="skill-partner">Instructor: {item.instructor || 'Elite Mentor'}</p>
                                </div>
                                <div className="skill-card-right">
                                    <button className="btn-project-action"><ExternalLink size={14} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="no-activity-text">No saved materials yet.</p>
                        )}
                    </div>
                </section>

                {/* ── GROUPS & DISCUSSIONS ── */}
                <section className="activity-section full-width">
                    <div className="section-header">
                        <div className="section-title-wrap">
                            <MessageSquare className="section-icon" size={20} />
                            <h2>Joined Rooms</h2>
                        </div>
                    </div>

                    <div className="groups-grid">
                        {joinedRooms.length > 0 ? joinedRooms.map(group => (
                            <div key={group._id} className="group-card-item card">
                                <div className="group-card-content">
                                    <div className="group-icon-placeholder">
                                        {group.name.charAt(0)}
                                    </div>
                                    <div className="group-info">
                                        <h3 className="group-name">{group.name}</h3>
                                        <span className="group-type">{group.category || 'General'}</span>
                                    </div>
                                </div>
                                <div className="group-footer">
                                    <span className="last-activity">Joined</span>
                                    <button className="btn-enter" onClick={() => onEnterRoom && onEnterRoom(group)}>Enter Room <ArrowRight size={14} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="no-activity-text">You haven't joined any rooms yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
