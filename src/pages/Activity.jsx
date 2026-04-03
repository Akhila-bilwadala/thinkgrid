import React, { useState, useEffect } from 'react';
import { 
    Search, MessageSquare, Trophy, Briefcase, 
    BookOpen, Target, MoreHorizontal, TrendingUp, 
    User, Layers, Share2, Plus, Bell, Fullscreen,
    Code, Palette, FlaskConical, Clock, Video, Check, Calendar, Newspaper, ExternalLink, RefreshCw, XCircle
} from 'lucide-react';
import './Activity.css';
import { getRooms } from '../api/rooms';
import { getMaterials } from '../api/materials';
import { getMyLabs, approveLabMember } from '../api/labs';
import { getMyExchanges, updateExchangeStatus } from '../api/exchanges';
import { getTechNews } from '../api/news';
import { useAuth } from '../context/AuthContext';
import { calculateElitePoints } from '../utils/pointsCalculator';

export default function Activity({ onEnterRoom }) {
    // ─── STATE MANAGEMENT ───
    const { user } = useAuth();
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);
    const [myLabs, setMyLabs] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [stats, setStats] = useState({ rooms: 0, notes: 0, projects: 0, contributions: 0 });
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Rooms');
    const [dailyNews, setDailyNews] = useState([]);
    const [rescheduleInput, setRescheduleInput] = useState({ id: null, date: '' });
    const [activeRequestsId, setActiveRequestsId] = useState(null); // ✅ Added for project requests

    // ─── DATA FETCHING LOGIC ───
    const fetchActivity = async () => {
        try {
            const [allRooms, allMaterials, userLabs] = await Promise.all([
                getRooms(), getMaterials(), getMyLabs()
            ]);
            
            const myRooms = allRooms.filter(r => r.members?.some(m => (m._id || m).toString() === user._id.toString()));
            setJoinedRooms(myRooms);
            const mySaved = allMaterials.filter(m => m.savedBy?.some(sid => sid.toString() === user._id.toString()));
            setSavedNotes(mySaved);
            setMyLabs(userLabs);
            
            const exchData = await getMyExchanges();
            setExchanges(exchData);
            const myUploads = allMaterials.filter(m => m.uploadedBy === user._id);
            
            setStats({ 
                rooms: myRooms.length, 
                notes: mySaved.length, 
                projects: userLabs.length, 
                contributions: myUploads.length 
            });
            const totalPts = calculateElitePoints(myUploads, userLabs, myRooms);
            setPoints(totalPts);

            try {
                const newsData = await getTechNews();
                setDailyNews(newsData || []);
            } catch (err) {
                console.error('Failed to fetch news:', err);
            }

        } catch (err) { 
            console.error('Error fetching activity:', err); 
        } finally { 
            setLoading(false); 
        }
    };

    // ─── EFFECTS ───
    useEffect(() => {
        fetchActivity();
    }, [user._id, user.name]);

    const handleApproveMember = async (labId, userId) => {
        try {
            await approveLabMember(labId, userId);
            fetchActivity();
        } catch (err) {
            console.error('Error approving member:', err);
        }
    };

    const handleUpdateStatus = async (id, status, scheduleDate) => {
        try {
            const data = { status };
            if (scheduleDate) data.scheduleDate = scheduleDate;
            await updateExchangeStatus(id, data);
            
            // clear inline input
            if (rescheduleInput.id === id) {
                setRescheduleInput({ id: null, date: '' });
            }
            
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
            {/* ─── HEADER SECTION ─── */}
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
            {/* ─── SUMMARY ROW: POINTS & STATS ─── */}
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

                {/* ─── DAILY TECH UPDATES: VIBRANT NEWS CARD ─── */}
                <div className="ana-card ana-tech-card">
                    <div className="ana-card-head">
                        <span className="ana-lbl">Daily Tech Updates</span>
                        <TrendingUp size={16} />
                    </div>
                    <div className="ana-tech-list-wide">
                        {dailyNews.length > 0 ? dailyNews.map((item, i) => (
                            <a key={i} href={item.url} target="_blank" rel="noreferrer" className="tech-item-link-wide">
                                <div className="tech-item-wide">
                                    <div className="tech-dot"></div>
                                    <div className="tech-info">
                                        <div className="tech-title">{item.title}</div>
                                        <div className="tech-desc">{item.source || 'TECH UPDATE'}</div>
                                    </div>
                                    <ExternalLink size={12} className="tech-link-icon" />
                                </div>
                            </a>
                        )) : (
                            <div className="ana-empty-small">No news updates yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── BOTTOM SECTION: TABS & LIST ─── */}
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
                    
                    {/* ─── TAB CONTENT LIST ─── */}
                    <div className="ana-list">
                        {activeTab === 'Rooms' && joinedRooms.map((room, i) => {
                            const text = (room.name + ' ' + (room.description || '')).toLowerCase();
                            let Icon = MessageSquare;
                            if (text.includes('dev') || text.includes('tech') || text.includes('code')) Icon = Code;
                            else if (text.includes('design') || text.includes('ui') || text.includes('art')) Icon = Palette;
                            else if (text.includes('science') || text.includes('math') || text.includes('physics')) Icon = FlaskConical;

                            return (
                                <div key={room._id} className="ana-list-item">
                                    <div className="item-main">
                                        <div className="item-icon-logo">
                                            <Icon size={18} color="white" />
                                        </div>
                                        <div className="item-info">
                                            <h4>{room.name}</h4>
                                            <p>Discussion Room</p>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button className="ana-btn-enter" onClick={() => onEnterRoom(room._id)}>Enter Room</button>
                                    </div>
                                </div>
                            );
                        })}
                        {activeTab === 'Materials' && savedNotes.map((note, i) => (
                            <div key={note._id} className="ana-list-item">
                                <div className="item-main">
                                    <div className="item-icon-logo">
                                        <Palette size={18} color="white" />
                                    </div>
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
                        {activeTab === 'Projects' && myLabs.map((lab) => {
                            const isHost = lab.createdBy === user?._id || (lab.createdBy?._id === user?._id);
                            const isApprovedMember = lab.members?.some(m => (m._id || m) === user?._id);
                            const isPendingMember = lab.pendingMembers?.some(m => (m._id || m) === user?._id);

                            return (
                                <div key={lab._id} className="ana-list-item project-item">
                                    <div className="item-main">
                                        <div className="item-icon-logo">
                                            <Code size={18} color="white" />
                                        </div>
                                        <div className="item-info">
                                            <div className="item-title-row">
                                                <h4>{lab.title}</h4>
                                                {isHost && <span className="host-tag">HOST</span>}
                                                {!lab.isApproved && <span className="status-pill pending">Awaiting Admin Approval</span>}
                                            </div>
                                            <p>{lab.description?.substring(0, 60)}...</p>
                                            
                                            {isHost && lab.pendingMembers?.length > 0 && activeRequestsId === lab._id && (
                                                <div className="pending-requests-section animate-up">
                                                    <h5>Join Requests ({lab.pendingMembers.length})</h5>
                                                    {lab.pendingMembers.map(pm => (
                                                        <div key={pm._id} className="request-row">
                                                            <div className="req-user">
                                                                <img src={pm.picture || 'https://via.placeholder.com/24'} alt="" />
                                                                <span>{pm.name}</span>
                                                            </div>
                                                            <button 
                                                                className="btn-approve-sm"
                                                                onClick={(e) => { e.stopPropagation(); handleApproveMember(lab._id, pm._id); }}
                                                            >
                                                                Accept
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="item-actions">
                {isHost ? (
                    <div className="project-host-actions">
                         {lab.pendingMembers?.length > 0 ? (
                            <button 
                                className={`ana-btn-enter ${activeRequestsId === lab._id ? 'active' : ''}`}
                                onClick={() => setActiveRequestsId(activeRequestsId === lab._id ? null : lab._id)}
                            >
                                {activeRequestsId === lab._id ? 'Hide Requests' : `View Requests (${lab.pendingMembers.length})`}
                            </button>
                         ) : (
                            <button className="ana-btn-enter outline" onClick={() => lab.repoUrl ? window.open(lab.repoUrl, '_blank') : window.location.href = '/labs'}>Manage Project</button>
                         )}
                    </div>
                ) : isApprovedMember ? (
                    <div className="project-member-actions">
                        {lab.repoUrl && (
                            <a href={lab.repoUrl} target="_blank" rel="noreferrer" className="ana-btn-enter outline github-link">
                                <Code size={14} /> Repo Link
                            </a>
                        )}
                        <button className="ana-btn-enter" onClick={() => lab.repoUrl ? window.open(lab.repoUrl, '_blank') : window.location.href = '/labs'}>View Project</button>
                    </div>
                ) : isPendingMember ? (
                    <span className="status-pill pending">Request Sent</span>
                ) : (
                    <button className="ana-btn-enter" onClick={() => window.location.href = '/labs'}>Explorer</button>
                )}
            </div>
        </div>
    );
})}
                        {activeTab === 'Skills' && (
                            <div className="ana-exchange-list">
                                {exchanges.length === 0 ? (
                                    <div className="ana-list-empty">
                                        <Layers size={32} />
                                        <p>No pending skill exchange requests.</p>
                                        <button className="ana-btn-sm" onClick={() => window.location.href = '/explore'}>Explore Community</button>
                                    </div>
                                ) : (
                                    exchanges.map(ex => {
                                        const partner = ex.sender._id === user._id ? ex.receiver : ex.sender;
                                        const iAmSender = ex.sender._id === user._id;
                                        // determine turn
                                        const isMyTurn = (ex.status === 'pending' || ex.status === 'reschedule_requested') && ex.proposedBy !== user._id;
                                        
                                        // duration & meeting active states
                                        const now = new Date();
                                        const sDate = new Date(ex.scheduleDate);
                                        const diffMins = (now - sDate) / 60000;
                                        const dur = ex.durationMinutes || 60;
                                        const isMeetingActive = ex.status === 'scheduled' && diffMins > -15 && diffMins < dur;
                                        const isPastMeeting = ex.status === 'scheduled' && diffMins >= dur;
                                        
                                        return (
                                            <div key={ex._id} className="ana-list-item exchange-item">
                                                <div className="item-main">
                                                    <div className="item-avatar">
                                                        <img src={partner.picture || '/bogdan.png'} alt="avatar" />
                                                    </div>
                                                    <div className="item-info">
                                                        <h4>{ex.topic}</h4>
                                                        <p>{iAmSender ? `Request sent to ${partner.name}` : `Request from ${partner.name}`}</p>
                                                        {ex.scheduleDate && (
                                                            <div className="schedule-detail">
                                                                <div className="date-info">
                                                                    <Calendar size={12} style={{marginRight:'4px'}}/>
                                                                    <span>{new Date(ex.scheduleDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <div className="time-info">
                                                                    <Clock size={12} style={{marginRight:'4px'}}/>
                                                                    <span>
                                                                        {new Date(ex.scheduleDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                        {' - '}
                                                                        {new Date(new Date(ex.scheduleDate).getTime() + (ex.durationMinutes || 60) * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {ex.meetingLink && ex.status === 'scheduled' && (
                                                            <a href={ex.meetingLink} target="_blank" rel="noreferrer" className="meet-link">
                                                                <Video size={12} /> Join Google Meet
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="ex-center-col">
                                                    <span className={`status-pill ${ex.status}`}>{ex.status.replace('_', ' ')}</span>
                                                    <span className="item-stat">{ex.credits} Credits</span>
                                                </div>

                                                <div className="item-actions ex-actions">
                                                    {isMyTurn && !rescheduleInput.id && (
                                                        <>
                                                            <button className="act-btn accept" onClick={() => handleUpdateStatus(ex._id, 'scheduled')}>
                                                                <Check size={14}/> Accept Time
                                                            </button>
                                                            <button className="act-btn outline" onClick={() => setRescheduleInput({ id: ex._id, date: ex.scheduleDate?.substring(0, 16) || '' })}>
                                                                <Clock size={14}/> Suggest New Time
                                                            </button>
                                                            <button className="act-btn reject" onClick={() => handleUpdateStatus(ex._id, 'cancelled')}>
                                                                <XCircle size={14}/> Reject Request
                                                            </button>
                                                        </>
                                                    )}

                                                    {rescheduleInput.id === ex._id && (
                                                        <div className="reschedule-box">
                                                            <input 
                                                                type="datetime-local" 
                                                                value={rescheduleInput.date} 
                                                                onChange={(e) => setRescheduleInput({ ...rescheduleInput, date: e.target.value })}
                                                            />
                                                            <button className="act-btn primary" onClick={() => handleUpdateStatus(ex._id, 'reschedule_requested', rescheduleInput.date)}>Send</button>
                                                            <button className="act-btn text-error" onClick={() => setRescheduleInput({ id: null, date: '' })}>Cancel</button>
                                                        </div>
                                                    )}

                                                    {!isMyTurn && (ex.status === 'pending' || ex.status === 'reschedule_requested') && (
                                                        <span className="awaiting-lbl">Awaiting Partner...</span>
                                                    )}

                                                    {ex.status === 'scheduled' && !isPastMeeting && (
                                                        <button 
                                                            className={`act-btn join-btn ${isMeetingActive ? 'active' : 'disabled'}`} 
                                                            onClick={() => isMeetingActive && ex.meetingLink ? window.open(ex.meetingLink, '_blank') : null}
                                                            disabled={!isMeetingActive}
                                                        >
                                                            <Video size={14} /> 
                                                            {isMeetingActive ? 'Join Meeting' : 'Starts Soon'}
                                                        </button>
                                                    )}
                                                    
                                                    {isPastMeeting && (
                                                        <button className="act-btn accept" onClick={() => handleUpdateStatus(ex._id, 'completed')}>Mark Completed</button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
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
