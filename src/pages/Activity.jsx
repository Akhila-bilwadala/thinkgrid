import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, MessageSquare, Zap, Star, Trophy, Briefcase, GraduationCap, Code, BookOpen, Layers } from 'lucide-react';
import './Activity.css';
import { getRooms } from '../api/rooms';
import { getMaterials } from '../api/materials';
import { getLabs } from '../api/labs';
import { useAuth } from '../context/AuthContext';
import { calculateElitePoints } from '../utils/pointsCalculator';

export default function Activity({ onEnterRoom }) {
    const { user } = useAuth();
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);
    const [joinedLabs, setJoinedLabs] = useState([]);
    const [skillExchange, setSkillExchange] = useState([]);
    const [stats, setStats] = useState({ rooms: 0, notes: 0, projects: 0, contributions: 0 });
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [growth, setGrowth] = useState({ value: 0, isPos: true });

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const [allRooms, allMaterials, allLabs] = await Promise.all([
                    getRooms(),
                    getMaterials(),
                    getLabs()
                ]);
                
                // 1. Filter Joined Rooms
                const myRooms = allRooms.filter(r => r.members?.some(m => (m._id || m) === user._id));
                setJoinedRooms(myRooms);

                // 2. Filter Saved Notes/Materials
                const mySaved = allMaterials.filter(m => m.savedBy?.includes(user._id));
                setSavedNotes(mySaved);

                // 3. Filter Joined Projects/Labs
                const myLabs = allLabs.filter(l => l.host === user.name || l.members?.includes(user.name));
                setJoinedLabs(myLabs);

                // 4. Filter Skill Exchange
                const exchangeItems = allMaterials.filter(m => m.category?.toLowerCase().includes('exchange') || m.isExchange);
                setSkillExchange(exchangeItems);

                // 5. Calculate Contributions (Uploads)
                const myUploads = allMaterials.filter(m => m.uploadedBy === user._id);
                
                setStats({
                    rooms: myRooms.length,
                    notes: mySaved.length,
                    projects: myLabs.length,
                    contributions: myUploads.length
                });

                // Calculate Points
                const totalPts = calculateElitePoints(myUploads, myLabs, myRooms);
                setPoints(totalPts);

                // ── LIVE ACTIVITY AGGREGATION ──
                const now = new Date();
                const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                
                // Helper: Get point contribution by item creation date
                const getPointsByDate = (items, pointsPerItem, dateRangeStart, dateRangeEnd) => {
                    const activityMap = {};
                    items.forEach(item => {
                        const created = new Date(item.createdAt);
                        if (created >= dateRangeStart && created <= dateRangeEnd) {
                            const dateStr = created.toDateString();
                            activityMap[dateStr] = (activityMap[dateStr] || 0) + pointsPerItem;
                        }
                    });
                    return activityMap;
                };

                // Current Week (Last 7 days)
                const startOfCurrentWeek = new Date(now);
                startOfCurrentWeek.setDate(now.getDate() - 6);
                startOfCurrentWeek.setHours(0,0,0,0);
                
                const endOfCurrentWeek = new Date(now);
                endOfCurrentWeek.setHours(23,59,59,999);

                // Last Week (7-14 days ago)
                const startOfLastWeek = new Date(startOfCurrentWeek);
                startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);
                
                const endOfLastWeek = new Date(startOfCurrentWeek);
                endOfLastWeek.setMilliseconds(-1);

                // Map points by date for current and last week
                const currentData = {
                    uploads: getPointsByDate(myUploads, 10, startOfCurrentWeek, endOfCurrentWeek),
                    labs: getPointsByDate(myLabs, 12, startOfCurrentWeek, endOfCurrentWeek),
                    rooms: getPointsByDate(myRooms, 13, startOfCurrentWeek, endOfCurrentWeek)
                };

                const lastWeekData = {
                    uploads: getPointsByDate(myUploads, 10, startOfLastWeek, endOfLastWeek),
                    labs: getPointsByDate(myLabs, 12, startOfLastWeek, endOfLastWeek),
                    rooms: getPointsByDate(myRooms, 13, startOfLastWeek, endOfLastWeek)
                };

                // Build Chart Data
                const activityChart = [];
                let thisWeekTotal = 0;
                let lastWeekTotal = 0;

                for (let i = 0; i < 7; i++) {
                    const d = new Date(startOfCurrentWeek);
                    d.setDate(startOfCurrentWeek.getDate() + i);
                    const ds = d.toDateString();
                    
                    const dayPoints = (currentData.uploads[ds] || 0) + 
                                     (currentData.labs[ds] || 0) + 
                                     (currentData.rooms[ds] || 0);
                    
                    thisWeekTotal += dayPoints;
                    activityChart.push({
                        day: days[d.getDay()],
                        points: dayPoints,
                        active: d.toDateString() === now.toDateString()
                    });
                }

                // Previous week total for growth
                Object.values(lastWeekData.uploads).forEach(v => lastWeekTotal += v);
                Object.values(lastWeekData.labs).forEach(v => lastWeekTotal += v);
                Object.values(lastWeekData.rooms).forEach(v => lastWeekTotal += v);

                setWeeklyActivity(activityChart);
                
                // Calculate Growth %
                if (lastWeekTotal === 0) {
                    setGrowth({ value: thisWeekTotal > 0 ? 100 : 0, isPos: true });
                } else {
                    const val = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
                    setGrowth({ value: Math.abs(val.toFixed(1)), isPos: val >= 0 });
                }

            } catch (err) {
                console.error('Error fetching activity:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [user._id, user.name]);

    if (loading) return <div className="loading-state">Syncing Elite Pulse...</div>;

    const quickStats = [
        { label: 'Rooms', count: stats.rooms, icon: <MessageSquare size={20} />, color: '#7C3AED', bg: '#F3E8FF' }, // Pastel Purple
        { label: 'Saved Notes', count: stats.notes, icon: <BookOpen size={20} />, color: '#D97706', bg: '#FEF3C7' },  // Pastel Orange
        { label: 'Projects', count: stats.projects, icon: <Briefcase size={20} />, color: '#059669', bg: '#ECFDF5' }, // Pastel Teal
        { label: 'Elite Points', count: points, icon: <Trophy size={20} />, color: '#DB2777', bg: '#FFF1F2' },      // Pastel Pink
    ];

    return (
        <div className="activity-page">
            {/* ── HEADER ── */}
            <header className="activity-header-new">
                <div className="welcome-section">
                    <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
                    <p>Your centralized hub for growth, notes, and collaborations.</p>
                </div>
                <div className="header-search">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Search your history..." />
                </div>
            </header>

            {/* ── QUICK STATS PILLS ── */}
            <div className="quick-stats-bar">
                {quickStats.map((s, i) => (
                    <div key={i} className="stat-pill" style={{ background: s.bg, borderColor: `${s.color}20` }}>
                        <div className="stat-pill-icon" style={{ background: '#FFFFFF', color: s.color }}>
                            {s.icon}
                        </div>
                        <div className="stat-pill-info">
                            <span className="count" style={{ color: '#1A1D1F' }}>{s.count}</span>
                            <span className="label" style={{ color: s.color, fontWeight: 700, fontSize: '0.65rem' }}>{s.label.toUpperCase()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── MY ACTIVE ROOMS ── */}
            <section className="rooms-horizontal-section">
                <div className="section-head">
                    <h2>My Active Rooms</h2>
                    <a href="#" className="view-all">See All</a>
                </div>
                <div className="horizontal-scroll">
                    {joinedRooms.length > 0 ? joinedRooms.map((room, i) => (
                        <button 
                            key={room._id} 
                            className="room-link-btn animate-up" 
                            onClick={() => onEnterRoom && onEnterRoom(room)}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {room.name}
                        </button>
                    )) : (
                        <p className="empty-state-text">Join a room to see your activity here.</p>
                    )}
                </div>
            </section>

            {/* ── SAVED NOTES & MATERIALS ── */}
            <section className="notes-horizontal-section">
                <div className="section-head">
                    <h2>Saved Materials & Notes</h2>
                    <a href="#" className="view-all">View Library</a>
                </div>
                <div className="horizontal-scroll">
                    {savedNotes.length > 0 ? savedNotes.map((note, i) => (
                        <button 
                            key={note._id} 
                            className="room-link-btn animate-up"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {note.title}
                        </button>
                    )) : (
                        <p className="empty-state-text">Save your first material to build your knowledge base.</p>
                    )}
                </div>
            </section>

            {/* ── MAIN GRID ── */}
            <div className="activity-grid-new">
                
                {/* ── ACTIVITY PULSE (LEFT) ── */}
                <div className="grid-card chart-card">
                    <div className="chart-header">
                        <div className="chart-title-wrap">
                            <h3>Elite Progress</h3>
                            <div className="growth-indicator">
                                <span className="up" style={{ color: growth.isPos ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                                    {growth.isPos ? '↗' : '↘'} {growth.value}%
                                </span>
                                <span className="growth-text" style={{ marginLeft: 8, fontSize: '0.8rem', color: '#9A9FA5' }}>vs last week</span>
                            </div>
                        </div>
                        <div className="points-badge">
                           {points} Elite Pts
                        </div>
                    </div>

                    <div className="bar-chart-container">
                        {weeklyActivity.map((d, i) => (
                            <div key={i} className="bar-wrapper">
                                <div className="bar-track">
                                    <div 
                                        className={`bar-fill ${d.active ? 'active' : ''}`} 
                                        style={{ height: `${Math.min(90, (d.points / 30) * 100)}%`, minHeight: d.points > 0 ? '10%' : '0' }}
                                    />
                                </div>
                                <span className="bar-label">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── JOINED PROJECTS (RIGHT) ── */}
                <div className="grid-card schedule-card">
                    <h3>Joined Projects</h3>
                    <div className="daily-schedule-list">
                        {joinedLabs.length > 0 ? joinedLabs.map(lab => (
                            <div key={lab._id} className="schedule-item">
                                <div className="schedule-icon" style={{ background: '#FFF7ED' }}>
                                    <Briefcase size={18} color="#F59E0B" />
                                </div>
                                <div className="schedule-info">
                                    <h4>{lab.title}</h4>
                                    <p>{lab.status || 'Active Lab'}</p>
                                </div>
                                <div className="schedule-action">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        )) : (
                            <p className="empty-state-text">Explore Active Labs to collaborate on projects.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* ── SKILL EXCHANGE SECTION (OPTIONAL) ── */}
            {skillExchange.length > 0 && (
                <section className="skill-exchange-section animate-up">
                    <div className="section-head">
                        <h2>Skill Exchange Library</h2>
                        <span className="view-all">{skillExchange.length} items available</span>
                    </div>
                    <div className="horizontal-scroll" style={{ marginBottom: 0 }}>
                        {skillExchange.map((item, i) => (
                            <div key={item._id} className="activity-card-new" style={{ minWidth: '220px' }}>
                                <div className="card-top" style={{ marginBottom: 12 }}>
                                    <div className="card-icon-box" style={{ background: '#FDF2F8', width: '36px', height: '36px' }}>
                                        <Layers size={16} color="#ec4899" />
                                    </div>
                                    <div className="card-meta">
                                        <h3 style={{ fontSize: '0.85rem' }}>{item.title}</h3>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
