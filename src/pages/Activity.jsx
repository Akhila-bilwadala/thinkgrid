import React, { useState, useEffect } from 'react';
import { 
  Search, MessageSquare, Trophy, Briefcase, 
  BookOpen, Target, MoreHorizontal, TrendingUp, 
  User, Layers, Share2, Plus, Bell, Fullscreen
} from 'lucide-react';
import './Activity.css';
import { getRooms } from '../api/rooms';
import { getMaterials } from '../api/materials';
import { getLabs } from '../api/labs';
import { getMyExchanges, updateExchangeStatus } from '../api/exchanges';
import { useAuth } from '../context/AuthContext';
import { calculateElitePoints } from '../utils/pointsCalculator';

export default function Activity({ onEnterRoom }) {
    const { user } = useAuth();
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);
    const [joinedLabs, setJoinedLabs] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [stats, setStats] = useState({ rooms: 0, notes: 0, projects: 0, contributions: 0 });
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Rooms');

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const [allRooms, allMaterials, allLabs] = await Promise.all([
                    getRooms(), getMaterials(), getLabs()
                ]);
                
                const myRooms = allRooms.filter(r => r.members?.some(m => (m._id || m) === user._id));
                setJoinedRooms(myRooms);
                const mySaved = allMaterials.filter(m => m.savedBy?.includes(user._id));
                setSavedNotes(mySaved);
                const myLabs = allLabs.filter(l => l.host === user.name || l.members?.includes(user.name));
                setJoinedLabs(myLabs);
                const exchData = await getMyExchanges();
                setExchanges(exchData);
                const myUploads = allMaterials.filter(m => m.uploadedBy === user._id);
                
                setStats({ 
                    rooms: myRooms.length, 
                    notes: mySaved.length, 
                    projects: myLabs.length, 
                    contributions: myUploads.length 
                });
                const totalPts = calculateElitePoints(myUploads, myLabs, myRooms);
                setPoints(totalPts);

            } catch (err) { 
                console.error('Error fetching activity:', err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchActivity();
    }, [user._id, user.name]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateExchangeStatus(id, { status });
            const updated = await getMyExchanges();
            setExchanges(updated);
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    if (loading) return <div className="ana-loading"><div className="ana-spinner"></div></div>;

    const tabs = ['Rooms', 'Materials', 'Projects', 'Skills'];

    return (
        <div className="ana-container">
            {/* Top Bar */}
            <header className="ana-header">
                <h1>Activity</h1>
                <div className="ana-header-actions">
                    <div className="ana-search">
                        <Search size={16} />
                        <input type="text" placeholder="Search Data..." />
                    </div>
                </div>
            </header>

            {/* Top Cards Row */}
            <div className="ana-summary-row">
                <div className="ana-card ana-summary-main">
                    <div className="ana-card-head">
                        <span className="ana-lbl summary-lbl">Total Elite Points</span>
                        <MoreHorizontal size={18} className="header-icon" />
                    </div>
                    
                    <div className="ana-points-amount-vibrant">
                        {points?.toLocaleString() || 0}
                        <span className="ana-points-unit-vibrant">pts</span>
                    </div>

                    <div className="ana-progress-container">
                        <div className="ana-progress-bar">
                            <div className="ana-progress-fill" style={{ width: `${(points % 100)}%` }}></div>
                        </div>
                        <div className="ana-progress-lbl">
                            <span>Next Milestone</span>
                            <span>{points + (100 - (points % 100))} pts</span>
                        </div>
                    </div>
                    
                    <div className="ana-breakdown">
                        <div className="bk-item">
                            <span className="bk-lbl">Rooms</span>
                            <span className="bk-val">{stats.rooms}</span>
                        </div>
                        <div className="bk-item">
                            <span className="bk-lbl">Labs</span>
                            <span className="bk-val">{stats.projects}</span>
                        </div>
                        <div className="bk-item">
                            <span className="bk-lbl">Notes</span>
                            <span className="bk-val">{stats.notes}</span>
                        </div>
                    </div>
                </div>

                <div className="ana-card ana-tech-card">
                    <div className="ana-card-head">
                        <span className="ana-lbl">Daily Tech Updates</span>
                        <TrendingUp size={16} />
                    </div>
                    <div className="ana-tech-list-wide">
                        {[
                            { title: "React 19 Stable", desc: "Improved Actions, Server Components, and the new React Compiler." },
                            { title: "GPT-4o & GPT-5", desc: "OpenAI announces multi-modal improvements and next-gen reasoning." },
                            { title: "AlphaFold 3", desc: "Scientific breakthrough in predicting molecular interactions." },
                            { title: "Vision Pro 2", desc: "Next-gen immersive displays with significantly reduced weight." },
                            { title: "Tailwind 4.0", desc: "A ground-up rewrite for maximum performance and zero configuration." }
                        ].map((item, i) => (
                            <div key={i} className="tech-item-wide">
                                <div className="tech-dot"></div>
                                <div className="tech-info">
                                    <div className="tech-title">{item.title}</div>
                                    <div className="tech-desc">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="ana-bottom-grid">
                <div className="ana-card ana-list-card">
                    <div className="ana-tabs">
                        {tabs.map(tab => (
                            <button 
                                key={tab} 
                                className={`ana-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="ana-list">
                        {activeTab === 'Rooms' && joinedRooms.map((room, i) => (
                            <div key={room._id} className="ana-list-item">
                                <div className="item-main">
                                    <div className="item-icon coral"><MessageSquare size={16}/></div>
                                    <div className="item-info">
                                        <h4>{room.name}</h4>
                                        <p>Discussion Room</p>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button className="ana-btn-enter" onClick={() => onEnterRoom(room._id)}>Enter Room</button>
                                </div>
                            </div>
                        ))}
                        {activeTab === 'Materials' && savedNotes.map((note, i) => (
                            <div key={note._id} className="ana-list-item">
                                <div className="item-main">
                                    <div className="item-icon navy"><BookOpen size={16}/></div>
                                    <div className="item-info">
                                        <h4>{note.title}</h4>
                                        <p>Saved Document</p>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button className="ana-btn-enter outline">Open Note</button>
                                </div>
                            </div>
                        ))}
                        {activeTab === 'Projects' && joinedLabs.map((lab, i) => (
                            <div key={lab._id} className="ana-list-item">
                                <div className="item-main">
                                    <div className="item-icon green"><Briefcase size={16}/></div>
                                    <div className="item-info">
                                        <h4>{lab.title || lab.name}</h4>
                                        <p>Collaboration Project</p>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button className="ana-btn-enter" onClick={() => window.location.href = '/labs'}>Enter Project</button>
                                </div>
                            </div>
                        ))}
                        {activeTab === 'Skills' && (
                            <div className="ana-exchange-list">
                                {exchanges.length === 0 ? (
                                    <div className="ana-list-empty">
                                        <Layers size={32} />
                                        <p>No pending skill exchange requests.</p>
                                        <button className="ana-btn-sm" onClick={() => window.location.href = '/explore'}>Explore Community</button>
                                    </div>
                                ) : (
                                    exchanges.map(ex => (
                                        <div key={ex._id} className="ana-list-item exchange-item">
                                            <div className="item-main">
                                                <div className="item-avatar">
                                                    <img src={(ex.sender._id === user._id ? ex.receiver.picture : ex.sender.picture) || '/bogdan.png'} alt="" />
                                                </div>
                                                <div className="item-info">
                                                    <h4>{ex.topic}</h4>
                                                    <p>{ex.sender._id === user._id ? `Request sent to ${ex.receiver.name}` : `Request from ${ex.sender.name}`}</p>
                                                </div>
                                            </div>
                                            <span className={`status-pill ${ex.status}`}>{ex.status}</span>
                                            <span className="item-stat">{ex.credits} Credits</span>
                                            <div className="item-actions">
                                                {ex.status === 'pending' && ex.receiver._id === user._id && (
                                                    <button className="act-btn accept" onClick={() => handleUpdateStatus(ex._id, 'accepted')}>Accept</button>
                                                )}
                                                {ex.status === 'accepted' && (
                                                    <div className="date-info">
                                                        <Clock size={12} />
                                                        <span>{new Date(ex.scheduleDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <MoreHorizontal size={16} className="item-more" />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="ana-card ana-chart-card">
                    <div className="ana-card-head">
                        <span className="ana-lbl">Weekly Stats</span>
                        <MoreHorizontal size={16} />
                    </div>
                    <div className="ana-bar-chart">
                        {[40, 60, 30, 95, 45, 75, 55].map((h, i) => (
                            <div key={i} className="chart-bar-container">
                                <div className={`chart-bar ${i === 3 ? 'active' : ''}`} style={{height: `${h}%`}}></div>
                                <span className="chart-lbl">{"MTWTFSS"[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="ana-chart-footer">
                        <div className="ft-main">
                            <div className="ft-icon"><Trophy size={16}/></div>
                            <div className="ft-info">
                                <h4>Points Milestone</h4>
                                <p>Current Week</p>
                            </div>
                        </div>
                        <div className="ft-val">{points}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
