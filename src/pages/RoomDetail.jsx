import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, MessageSquare, ThumbsUp, Send, Plus, X, 
    Search, Pin, Paperclip, Share2, MoreVertical, 
    CheckCircle2, AlertCircle, Zap, Bug, Tag
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
          <button className="rd-create-btn" onClick={() => setShowNewPost(true)}>
            <Plus size={16} /> Create
          </button>
          <div className="rd-member-peek">
            <div className="rd-avatar-stack">
              <div className="rd-mini-avatar" style={{ background: '#6366f1' }}>A</div>
              <div className="rd-mini-avatar" style={{ background: '#ef4444' }}>B</div>
              <div className="rd-mini-avatar-more">+12</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW POST MODAL ── */}
      {showNewPost && (
        <div className="rd-overlay" onClick={() => setShowNewPost(false)}>
          <div className="rd-modal" onClick={e => e.stopPropagation()}>
            <div className="rd-modal-head">
              <span className="rd-mini-label">Post to community</span>
              <button className="rd-close" onClick={() => setShowNewPost(false)}><X size={18} /></button>
            </div>
            
            <div className="rd-modal-content">
              <div className="rd-input-group">
                <input
                  placeholder="New Discussion Title"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  className="rd-form-input"
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
            
            <div className="rd-modal-actions">
              <button className="rd-cancel" onClick={() => setShowNewPost(false)}>Cancel</button>
              <button className="rd-submit" onClick={handleCreatePost}>Publish Post</button>
            </div>
          </div>
        </div>
      )}

      {/* ── POST FEED ── */}
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
              
              <div className="rd-post-main">
                <div className="rd-post-sidebar">
                  <div className="rd-author-square">{getInitials(post.authorName)}</div>
                  <div className="rd-vote-stack">
                     <button 
                        className={`rd-vote-btn ${isLiked ? 'active' : ''}`}
                        onClick={() => handleToggleLike(post._id)}
                     >
                        <ThumbsUp size={16} />
                     </button>
                     <span className="rd-vote-count">{post.likedBy?.length || 0}</span>
                  </div>
                </div>

                <div className="rd-post-content">
                  <div className="rd-post-meta">
                    <span className="rd-author-full">{post.authorName}</span>
                    <span className="rd-dot">•</span>
                    <span className="rd-post-date">{timeAgo(post.createdAt)}</span>
                    <div className="rd-post-badge" style={{ background: tagInfo.bg, color: tagInfo.color }}>
                       {tagInfo.icon}
                       {tagInfo.label}
                    </div>
                  </div>

                  {post.title && <h2 className="rd-post-heading">{post.title}</h2>}
                  <p className="rd-post-body-text">{post.text}</p>

                  <div className="rd-post-foot">
                    <button className="rd-foot-link" onClick={() => toggleReplies(post._id)}>
                      <MessageSquare size={14} /> {post.replies?.length || 0} Comments
                    </button>
                    <button className="rd-foot-link" onClick={() => { setReplyingTo(post._id); setOpenReplies(p => ({...p, [post._id]: true})); }}>
                      Help / Reply
                    </button>
                    <button className="rd-foot-link"><Share2 size={14} /> Share</button>
                    <button className="rd-more-btn"><MoreVertical size={16} /></button>
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
              </div>
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
    </div>
  );
}
