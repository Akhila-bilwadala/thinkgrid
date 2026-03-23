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
                        <span className="ana-lbl">Total Elite Points</span>
                        <MoreHorizontal size={16} />
                    </div>
                    <div className="ana-val-large">{(points / 1000).toFixed(4)}K</div>
                    <div className="ana-breakdown">
                        <div className="bk-item">
                           <span className="bk-lbl">Rooms</span>
                           <span className="bk-val">%{Math.round((stats.rooms / (stats.rooms + stats.projects + stats.notes || 1)) * 100)}</span>
                        </div>
                        <div className="bk-item">
                           <span className="bk-lbl">Labs</span>
                           <span className="bk-val">%{Math.round((stats.projects / (stats.rooms + stats.projects + stats.notes || 1)) * 100)}</span>
                        </div>
                        <div className="bk-item">
                           <span className="bk-lbl">Notes</span>
                           <span className="bk-val">%{Math.round((stats.notes / (stats.rooms + stats.projects + stats.notes || 1)) * 100)}</span>
                        </div>
                    </div>
                </div>

                <div className="ana-card ana-donut-card">
                    <div className="ana-card-head">
                        <span className="ana-lbl">Activity Mix</span>
                        <MoreHorizontal size={16} />
                    </div>
                    <div className="ana-donut-content">
                        <div className="ana-donut-svg">
                            <svg viewBox="0 0 36 36" className="donut">
                                <circle className="donut-hole" cx="18" cy="18" r="15.9155" fill="#fff"></circle>
                                <circle className="donut-ring" cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f1f1f1" strokeWidth="3"></circle>
                                <circle className="donut-segment" cx="18" cy="18" r="15.9155" fill="transparent" stroke="#F27A54" strokeWidth="3" strokeDasharray="70 30" strokeDashoffset="25"></circle>
                                <circle className="donut-segment" cx="18" cy="18" r="15.9155" fill="transparent" stroke="#1A1A2E" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="55"></circle>
                            </svg>
                            <div className="donut-center">
                                <span className="donut-val">{Math.round((stats.rooms + stats.projects + stats.notes) / 10)}k</span>
                            </div>
                        </div>
                        <div className="ana-donut-legend">
                            <div className="lg-item"><span className="lg-dot coral"></span> Active %80</div>
                            <div className="lg-item"><span className="lg-dot navy"></span> Passive %20</div>
                        </div>
                    </div>
                </div>

                <div className="ana-side-stats">
                    <div className="ana-card ana-mini">
                        <div className="mini-top">
                            <span className="mini-val">{stats.rooms}</span>
                            <span className="mini-lbl">Rooms</span>
                        </div>
                        <div className="mini-bar"><div className="bar-fill" style={{width: '70%', background: '#F27A54'}}></div></div>
                    </div>
                    <div className="ana-card ana-mini">
                        <div className="mini-top">
                            <span className="mini-val">{stats.notes}</span>
                            <span className="mini-lbl">Materials</span>
                        </div>
                        <div className="mini-bar"><div className="bar-fill" style={{width: '45%', background: '#1A1A2E'}}></div></div>
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
                                <span className="item-cat">Global</span>
                                <span className="item-stat">{room.members?.length || 0} Members</span>
                                <div className="item-growth pos">+{Math.floor(Math.random() * 10)}%</div>
                                <MoreHorizontal size={16} className="item-more" />
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
                                <span className="item-cat">Material</span>
                                <span className="item-stat">Saved</span>
                                <div className="item-growth pos">+5%</div>
                                <MoreHorizontal size={16} className="item-more" />
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
                                <span className="item-cat">Project</span>
                                <span className="item-stat">Active</span>
                                <div className="item-growth pos">+12%</div>
                                <MoreHorizontal size={16} className="item-more" />
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
