import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, MessageSquare, ThumbsUp, Send, Plus, X, 
    Search, Pin, Paperclip, Share2, MoreVertical, 
    CheckCircle2, AlertCircle, Zap, Bug, Tag, LogOut,
    MoreHorizontal, ChevronUp, ChevronDown, Award
} from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import './RoomDetail.css';

const TAG_CONFIG = {
  Discussion:     { label: 'Discussion',   color: '#6366f1', bg: '#EEF2FF', icon: <MessageSquare size={14} /> },
  'Tech Update': { label: 'Tech Update',  color: '#8b5cf6', bg: '#F5F3FF', icon: <Zap size={14} /> },
  'Error Help':   { label: 'Error Help',   color: '#f43f5e', bg: '#FFF1F2', icon: <Bug size={14} /> },
  Question:       { label: 'Question',     color: '#f59e0b', bg: '#FFFBEB', icon: <AlertCircle size={14} /> },
};

export default function RoomDetail({ room, onBack }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  
  // New Post State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('Discussion');
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [openReplies, setOpenReplies] = useState({});

  const fetchPosts = async (search = '') => {
    try {
      const url = `/rooms/${room._id}/posts${search ? `?search=${search}` : ''}`;
      const { data } = await client.get(url);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(searchQuery);
  }, [room._id, searchQuery]);

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    try {
      await client.post(`/rooms/${room._id}/posts`, {
        title: newPostTitle,
        text: newPostText,
        tag: newPostTag,
      });
      setNewPostTitle('');
      setNewPostText('');
      setNewPostTag('Discussion');
      setShowNewPost(false);
      fetchPosts(searchQuery);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const { data } = await client.post(`/posts/${postId}/toggle-like`);
      setPosts(prev => prev.map(p => p._id === postId ? data : p));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleReply = async (postId) => {
    if (!replyText.trim()) return;
    try {
      const { data } = await client.post(`/rooms/${room._id}/posts/${postId}/reply`, { text: replyText });
      setPosts(prev => prev.map(p => p._id === postId ? data : p));
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  const handleToggleReplyLike = async (postId, replyId) => {
    try {
      const { data } = await client.post(`/posts/${postId}/replies/${replyId}/toggle-like`);
      setPosts(prev => prev.map(p => p._id === postId ? data : p));
    } catch (err) {
      console.error('Failed to toggle reply like:', err);
    }
  };

  const toggleReplies = (postId) => {
    setOpenReplies(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm('Are you sure you want to leave this room? You will be removed from the member list.')) return;
    try {
      const { leaveRoom } = await import('../api/rooms');
      await leaveRoom(room._id);
      localStorage.removeItem('activeRoomId');
      onBack(); // go back to the rooms list
    } catch (err) {
      console.error('Failed to leave room:', err);
    }
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="rd-container animate-up">
      {/* ── ULTRALIGHT RIBBON HEADER ── */}
      <div className="rd-ribbon-header">
        <div className="rd-ribbon-left">
          <button className="rd-circle-back" onClick={onBack} title="Back to Rooms">
            <ArrowLeft size={16} />
          </button>
          <div className="rd-ribbon-brand">
            <div className="rd-ribbon-avatar">{getInitials(room.name)}</div>
            <div className="rd-ribbon-text">
              <h1>{room.name}</h1>
            </div>
          </div>
          <div className="rd-filter-tabs">
            <button className="rd-tab active">All Posts</button>
            <button className="rd-tab">Pinned</button>
          </div>
        </div>

        <div className="rd-ribbon-right">
          <div className="rd-room-search">
            <Search size={14} />
            <input 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={`rd-create-btn ${showNewPost ? 'active' : ''}`} onClick={() => setShowNewPost(!showNewPost)}>
            {showNewPost ? <X size={16} /> : <Plus size={16} />}
            {showNewPost ? 'Cancel' : 'Create'}
          </button>
          <div className="rd-member-peek">
            <button className="rd-leave-action-btn" onClick={handleLeaveRoom} title="Unjoin and Exit Room">
              <LogOut size={14} /> Leave
            </button>
          </div>
        </div>
      </div>

      {/* ── CONDITIONAL RENDERING: FEED OR COMPOSER ── */}
      <div className="rd-main-flow">
        {showNewPost ? (
          <div className="rd-inline-composer animate-up">
            <div className="rd-composer-header">
              <span className="rd-mini-label">Post to community</span>
              <h2>New Discussion</h2>
            </div>
            
            <div className="rd-composer-body">
              <div className="rd-input-group">
                <input
                  placeholder="New Discussion Title"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  className="rd-form-input"
                  autoFocus
                />
                <textarea
                  placeholder="What's on your mind? Share details, ask for help, or post an update..."
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  className="rd-form-textarea"
                />
              </div>

              <div className="rd-input-group">
                <label>Category</label>
                <div className="rd-picker-row">
                  {Object.entries(TAG_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setNewPostTag(key)}
                      className={`rd-tag-choice ${newPostTag === key ? 'active' : ''}`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rd-tool-strip">
                 <button className="rd-tool-btn"><Paperclip size={14} /> Attach File</button>
                 <button className="rd-tool-btn"><Tag size={14} /> Add Tags</button>
              </div>
            </div>
            
            <div className="rd-composer-footer">
              <button className="rd-cancel" onClick={() => setShowNewPost(false)}>Cancel</button>
              <button className="rd-submit" onClick={handleCreatePost}>Publish Post</button>
            </div>
          </div>
        ) : (
          <div className="rd-feed-body">
            {loading ? (
              <div className="rd-state-msg">
                 <div className="rd-spinner"></div>
                 <p>Syncing discussion threads...</p>
              </div>
            ) : posts.length > 0 ? posts.map(post => {
          const isLiked = post.likedBy?.includes(user._id);
          const tagInfo = TAG_CONFIG[post.tag] || TAG_CONFIG.Discussion;
          
          return (
            <div key={post._id} className={`rd-post-item ${post.isPinned ? 'pinned' : ''}`}>
              {post.isPinned && <div className="rd-pinned-label"><Pin size={10} /> Pinned by Moderator</div>}
              
              {/* Header */}
              <div className="rd-post-head">
                <div className="rd-post-author-info">
                  <div className="rd-author-avatar">{getInitials(post.authorName)}</div>
                  <span className="rd-author-name">s/{post.authorName?.replace(/\s+/g, '').toLowerCase() || 'thinker'}</span>
                  <span className="rd-dot">•</span>
                  <span className="rd-post-time">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="rd-post-head-actions">
                  <button className="rd-follow-btn">Follow <Plus size={12} style={{marginLeft: 2}}/></button>
                  <button className="rd-more-btn"><MoreHorizontal size={16}/></button>
                </div>
              </div>

              {/* Body */}
              <div className="rd-post-body">
                <div className="rd-post-text-content">
                  {post.title && <h2 className="rd-post-title">{post.title}</h2>}
                  <p className="rd-post-text">{post.text}</p>
                </div>
                {/* Optional image mock */}
                <div className="rd-post-image-box">
                  <div className="rd-post-img-placeholder"></div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="rd-post-foot">
                <div className="rd-action-pill vote-pill">
                  <button className={`rd-vote-up ${isLiked ? 'active' : ''}`} onClick={() => handleToggleLike(post._id)}>
                     <ChevronUp size={18} />
                  </button>
                  <span className="rd-vote-count">{post.likedBy?.length || 0}</span>
                  <button className="rd-vote-down"><ChevronDown size={18} /></button>
                </div>
                
                <button className="rd-action-pill" onClick={() => toggleReplies(post._id)}>
                  <MessageSquare size={16} /> <span className="rd-action-count">{post.replies?.length || 0}</span>
                </button>
                
                <button className="rd-action-pill">
                  Share <Share2 size={14} style={{marginLeft: 4}}/>
                </button>

                <button className="rd-action-icon" onClick={() => { setReplyingTo(post._id); setOpenReplies(p => ({...p, [post._id]: true})); }}>
                  <Award size={16} />
                </button>
              </div>

                  {/* 🧵 THREADED REPLIES */}
                  {openReplies[post._id] && (
                    <div className="rd-thread-space">
                      {post.replies?.map((reply, i) => {
                        const isReplyLiked = reply.likedBy?.includes(user._id);
                        return (
                          <div key={i} className="rd-reply-item">
                            <div className="rd-reply-avatar-box">{getInitials(reply.authorName)}</div>
                            <div className="rd-reply-bubble">
                              <div className="rd-reply-header">
                                <span className="rd-reply-user">{reply.authorName}</span>
                                <span className="rd-reply-ago">{timeAgo(reply.createdAt)}</span>
                              </div>
                              <p className="rd-reply-msg">{reply.text}</p>
                              <div className="rd-reply-actions">
                                 <button 
                                    className={`rd-reply-like ${isReplyLiked ? 'active' : ''}`}
                                    onClick={() => handleToggleReplyLike(post._id, reply._id)}
                                 >
                                    <ThumbsUp size={12} /> {reply.likedBy?.length || 0}
                                 </button>
                                 <button className="rd-reply-util">Reply</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Reply Input */}
                      {replyingTo === post._id ? (
                        <div className="rd-composer-wrap">
                          <div className="rd-mini-avatar-static">{getInitials(user?.name)}</div>
                          <div className="rd-composer-box">
                            <textarea
                              placeholder="Type your help or comment..."
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleReply(post._id))}
                            />
                            <button className="rd-send-btn" onClick={() => handleReply(post._id)}>
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="rd-inline-reply-trigger" onClick={() => setReplyingTo(post._id)}>
                           Add a comment to this thread...
                        </button>
                      )}
                    </div>
                  )}
            </div>
          );
        }) : (
          <div className="rd-empty-state">
             <div className="rd-empty-icon-box">
                <MessageSquare size={48} />
             </div>
             <h2>No discussions found</h2>
             <p>Be the first to share an update, ask for help, or start a talk here!</p>
          </div>
        )}
      </div>
     )}
    </div>
   </div>
  );
}
