import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2,
    MapPin,
    Calendar,
    ExternalLink,
    MoreHorizontal,
    Share2,
    Star,
    Award,
    UserPlus,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Camera
} from 'lucide-react';
import './Profile.css';
import { getProfile, updateProfile, uploadProfilePicture, uploadBgPicture } from '../api/users';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user: authUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const profilePicInputRef = useRef(null);
    const bgPicInputRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // Profile Data State
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        skills: [],
        experience: [],
        achievements: [],
        role: '',
        company: '',
        picture: '',
        bgPicture: '',
        handle: '',
        portfolioUrl: ''
    });

    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile({
                    ...data,
                    handle: data.email ? data.email.split('@')[0] : 'user',
                    skills: data.skills || [],
                    experience: data.experience || [],
                    achievements: data.achievements || [],
                    portfolioUrl: data.portfolioUrl || '',
                    bgPicture: data.bgPicture || ''
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            await updateProfile(profile);
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile. Please try again.');
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target.result;
            setProfile(prev => ({ ...prev, picture: base64 }));
            try {
                await uploadProfilePicture(base64);
            } catch (err) {
                console.error('Failed to upload profile picture:', err);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleBgPicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target.result;
            setProfile(prev => ({ ...prev, bgPicture: base64 }));
            try {
                await uploadBgPicture(base64);
            } catch (err) {
                console.error('Failed to upload background picture:', err);
            }
        };
        reader.readAsDataURL(file);
    };

    // Experience Handlers
    const addExperience = () => {
        const newItem = {
            id: Date.now(),
            company: 'New Company',
            role: 'New Role',
            type: 'Remote',
            duration: 'Duration',
            desc: 'Job description goes here...'
        };
        setProfile({ ...profile, experience: [newItem, ...profile.experience] });
    };

    const removeExperience = (id) => {
        setProfile({ ...profile, experience: profile.experience.filter(exp => (exp.id || exp._id) !== id) });
    };

    const updateExperience = (id, field, value) => {
        setProfile({
            ...profile,
            experience: profile.experience.map(exp => (exp.id || exp._id) === id ? { ...exp, [field]: value } : exp)
        });
    };

    // Skill Handlers
    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill] });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
    };

    // Achievement Handlers
    const addAchievement = () => {
        const newItem = {
            id: Date.now(),
            icon: 'Award',
            text: 'New Achievement'
        };
        setProfile({ ...profile, achievements: [...profile.achievements, newItem] });
    };

    const removeAchievement = (id) => {
        setProfile({ ...profile, achievements: profile.achievements.filter(a => (a.id || a._id) !== id) });
    };

    const updateAchievement = (id, text) => {
        setProfile({
            ...profile,
            achievements: profile.achievements.map(a => (a.id || a._id) === id ? { ...a, text } : a)
        });
    };

    if (loading) return <div className="loading-state">Loading Profile...</div>;

    return (
        <div className="profile-redesign animate-up">
            <div className="profile-layout-grid">

                {/* Main Column */}
                <div className="profile-main-col">

                    {/* Hidden file inputs */}
                    <input
                        ref={profilePicInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfilePicChange}
                    />
                    <input
                        ref={bgPicInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleBgPicChange}
                    />

                    {/* Centered Header Card */}
                    <div className="profile-header-card card">
                        <div className="profile-cover" onClick={() => bgPicInputRef.current.click()} style={{ cursor: 'pointer' }}>
                            <img
                                src={profile.bgPicture || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop"}
                                alt="cover"
                            />
                            <div className="cover-upload-overlay">
                                <Camera size={28} />
                                <span>Change Cover</span>
                            </div>
                            <div className="cover-actions" onClick={e => e.stopPropagation()}>
                                <button className="cover-btn"><Share2 size={16} /></button>
                                <button className="cover-btn"><MoreHorizontal size={16} /></button>
                            </div>
                        </div>

                        <div className="profile-header-content">
                            <div className="profile-avatar-centered" onClick={() => profilePicInputRef.current.click()} style={{ cursor: 'pointer' }}>
                                <img src={profile.picture || "/bogdan.png"} alt={profile.name} />
                                <div className="avatar-upload-overlay">
                                    <Camera size={20} />
                                </div>
                                <div className="status-badge" />
                            </div>

                            <div className="profile-identity">
                                <div className="profile-handle">@{profile.handle}</div>
                                <h1 className="profile-name">
                                    {isEditing ? (
                                        <input 
                                            className="edit-input-title"
                                            value={profile.name}
                                            onChange={e => setProfile({...profile, name: e.target.value})}
                                        />
                                    ) : (
                                        <>
                                            {profile.name} <CheckCircle2 size={20} className="verified-icon" />
                                        </>
                                    )}
                                </h1>
                                
                                {isEditing ? (
                                    <textarea 
                                        className="edit-textarea-bio"
                                        value={profile.bio}
                                        onChange={e => setProfile({...profile, bio: e.target.value})}
                                        placeholder="Add a bio..."
                                    />
                                ) : (
                                    <p className="profile-headline">{profile.bio || 'Add a bio to tell others about yourself'}</p>
                                )}

                                {isEditing && (
                                    <div className="edit-portfolio-row" style={{ marginTop: '12px' }}>
                                        <input 
                                            placeholder="Portfolio URL (https://...)"
                                            value={profile.portfolioUrl}
                                            onChange={e => setProfile({...profile, portfolioUrl: e.target.value})}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                )}

                                <div className="profile-meta-row">
                                    <span className="meta-item"><MapPin size={14} /> ThinkGrid HQ</span>
                                    <span className="meta-divider">|</span>
                                    <span className="meta-item"><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    {profile.portfolioUrl && (
                                        <>
                                            <span className="meta-divider">|</span>
                                            <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="meta-item-link">
                                                <ExternalLink size={14} /> Portfolio
                                            </a>
                                        </>
                                    )}
                                </div>

                                <div className="profile-header-actions">
                                    <button className={isEditing ? "btn-save-profile" : "btn-edit-secondary"} onClick={toggleEdit}>
                                        {isEditing ? <><Save size={18} /> Finish Editing</> : 'Edit profile'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="profile-sections-stack">
                        {/* Experience Section */}
                        <div className="content-section card">
                            <div className="section-header-row">
                                <h2 className="section-title">Experience</h2>
                                {isEditing && (
                                    <button className="btn-add-item" onClick={addExperience}>
                                        <Plus size={16} /> Add Experience
                                    </button>
                                )}
                            </div>
                            <div className="experience-list">
                                {profile.experience.map(exp => (
                                    <div key={exp.id || exp._id} className="experience-item">
                                        <div className="exp-dot" />
                                        <div className="exp-content">
                                            <div className="exp-header">
                                                {isEditing ? (
                                                    <div className="edit-row-full">
                                                        <input 
                                                            className="edit-input-bold"
                                                            value={exp.company}
                                                            onChange={e => updateExperience((exp.id || exp._id), 'company', e.target.value)}
                                                        />
                                                        <select 
                                                            className="edit-select"
                                                            value={exp.type}
                                                            onChange={e => updateExperience((exp.id || exp._id), 'type', e.target.value)}
                                                        >
                                                            <option value="Remote">Remote</option>
                                                            <option value="On-site">On-site</option>
                                                            <option value="Hybrid">Hybrid</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <h3 className="exp-company">{exp.company} <span className="exp-type">{exp.type}</span></h3>
                                                )}
                                                
                                                {isEditing ? (
                                                    <input 
                                                        className="edit-input-small"
                                                        value={exp.duration}
                                                        onChange={e => updateExperience((exp.id || exp._id), 'duration', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="exp-duration">{exp.duration}</span>
                                                )}
                                            </div>
                                            
                                            {isEditing ? (
                                                <input 
                                                    className="edit-input-role"
                                                    value={exp.role}
                                                    onChange={e => updateExperience((exp.id || exp._id), 'role', e.target.value)}
                                                />
                                            ) : (
                                                <div className="exp-role">{exp.role}</div>
                                            )}

                                            {isEditing ? (
                                                <textarea 
                                                    className="edit-textarea"
                                                    value={exp.desc}
                                                    onChange={e => updateExperience((exp.id || exp._id), 'desc', e.target.value)}
                                                />
                                            ) : (
                                                <p className="exp-desc">{exp.desc}</p>
                                            )}

                                            {isEditing && (
                                                <button className="btn-remove-item" onClick={() => removeExperience((exp.id || exp._id))}>
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="content-section card">
                            <div className="section-header-row">
                                <h2 className="section-title">Achievements</h2>
                                {isEditing && (
                                    <button className="btn-add-item" onClick={addAchievement}>
                                        <Plus size={16} /> Add Achievement
                                    </button>
                                )}
                            </div>
                            <div className="achieve-grid">
                                {profile.achievements.map(ach => (
                                    <div key={ach.id || ach._id} className="achieve-item">
                                        {ach.icon === 'Award' ? <Award className="ach-icon" /> : <Star className="ach-icon" />}
                                        {isEditing ? (
                                            <div className="edit-ach-wrap">
                                                <input 
                                                    className="edit-input-ach"
                                                    value={ach.text}
                                                    onChange={e => updateAchievement((ach.id || ach._id), e.target.value)}
                                                />
                                                <button className="btn-icon-remove" onClick={() => removeAchievement((ach.id || ach._id))}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span>{ach.text}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="profile-side-col">

                    {/* Top Skills Card */}
                    <div className="side-card card">
                        <div className="card-head">
                            <h2 className="side-card-title">Top Skills</h2>
                        </div>
                        
                        {isEditing && (
                            <form className="add-skill-form" onSubmit={addSkill}>
                                <input 
                                    className="add-skill-input"
                                    placeholder="Add a skill..."
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                />
                                <button type="submit" className="btn-icon-add"><Plus size={18} /></button>
                            </form>
                        )}

                        <div className="skills-pill-cloud">
                            {profile.skills.map(skill => (
                                <span key={skill} className="skill-pill-item">
                                    {skill}
                                    {isEditing && (
                                        <X 
                                            size={14} 
                                            className="remove-skill-icon" 
                                            onClick={() => removeSkill(skill)}
                                        />
                                    )}
                                </span>
                            ))}
                        </div>
                        {!isEditing && profile.skills.length > 5 && <button className="btn-view-more">Show all skills</button>}
                    </div>

                    {/* Reviews Card */}
                    <div className="side-card card reviews-card">
                        <div className="reviews-tabs">
                            <h2 className="side-card-title" style={{ marginBottom: 0 }}>Reviews</h2>
                        </div>

                        <div className="reviews-list">
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', padding: '10px' }}>No reviews yet.</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
