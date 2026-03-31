import React, { useState, useEffect, useRef } from 'react';
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
  Discussion:     { label: 'Discussion',   color: '#FF8C00', bg: '#FFF7ED', icon: <MessageSquare size={14} /> },
  'Tech Update': { label: 'Tech Update',  color: '#FF2D55', bg: '#FFF1F2', icon: <Zap size={14} /> },
  'Error Help':   { label: 'Error Help',   color: '#7F00FF', bg: '#F5F3FF', icon: <Bug size={14} /> },
  Question:       { label: 'Question',     color: '#EC4899', bg: '#FDF2F8', icon: <AlertCircle size={14} /> },
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
  const [customTags, setCustomTags] = useState([]);
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [openReplies, setOpenReplies] = useState({});
  
  // Refs
  const fileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

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
    if (!newPostText.trim()) {
      alert('Your inquiry contains no documentation. Please draft your findings in the text area before publishing.');
      return;
    }
    try {
      console.log('Publishing Inquiry', {
        title: newPostTitle,
        text: newPostText,
        tag: newPostTag,
        hasFile: !!attachedFile
      });

      if (attachedFile) {
        const formData = new FormData();
        formData.append('text', newPostText);
        formData.append('title', newPostTitle);
        formData.append('tag', newPostTag);
        formData.append('image', attachedFile);
        
        await client.post(`/rooms/${room._id}/posts`, formData);
      } else {
        await client.post(`/rooms/${room._id}/posts`, {
          text: newPostText,
          title: newPostTitle,
          tag: newPostTag
        });
      }

      setNewPostTitle('');
      setNewPostText('');
      setNewPostTag('Discussion');
      setAttachedFile(null);
      setShowNewPost(false);
      fetchPosts(searchQuery);
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post: ' + (err.response?.data?.error || err.message));
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
      {/* ── SCHOLARLY INQUIRY HEADER ── */}
      <div className="rd-scholarly-header animate-up">
        <button className="rd-floating-back" onClick={onBack} title="Back to Rooms">
          <ArrowLeft size={18} />
        </button>
        
        <div className="rd-header-content">
          <h1 className="rd-room-title">{room.name}</h1>
          <p className="rd-room-description">{room.description || 'Welcome to the central nexus of peer-to-peer technical problem solving. Here, errors are deconstructed and solutions are peer-reviewed for mathematical and logical rigor.'}</p>
        </div>

        <div className="rd-header-actions">
          <div className="rd-mini-search">
            <Search size={14} />
            <input 
              placeholder="Search inquiry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={`rd-create-btn ${showNewPost ? 'active' : ''}`} onClick={() => setShowNewPost(!showNewPost)}>
            {showNewPost ? <X size={16} /> : <Plus size={16} />}
            {showNewPost ? 'Cancel' : 'New Discussion'}
          </button>
          <button className="rd-leave-btn" onClick={handleLeaveRoom} title="Leave Room">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* ── CONDITIONAL RENDERING: FEED OR COMPOSER ── */}
      <div className="rd-main-flow">
        {showNewPost ? (
          <div className="rd-inline-composer animate-up">
            <div className="rd-composer-header">
              <span className="rd-mini-label">Scholarly Inquiry</span>
              <h2>New Discussion</h2>
            </div>
            
            <div className="rd-composer-body">
              <div className="rd-document-inputs">
                <input
                  placeholder="Inquiry Title..."
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  className="rd-form-input"
                  autoFocus
                />
                <textarea
                  placeholder="Draft your inquiry here. Use precise terminology for peer review..."
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  className="rd-form-textarea"
                />
              </div>

              <div className="rd-taxonomy-section">
                <label>Classification Taxonomy</label>
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
                  {customTags.map(t => (
                    <button
                      key={t}
                      onClick={() => setNewPostTag(t)}
                      className={`rd-tag-choice ${newPostTag === t ? 'active' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="rd-tool-strip">
                 <button className="rd-tool-btn" onClick={() => fileInputRef.current?.click()}>
                   <Paperclip size={14} /> {attachedFile ? attachedFile.name : 'Attach Image'}
                 </button>
                 <button className="rd-tool-btn" onClick={() => {
                   const t = prompt('Define a custom taxonomy tag:');
                   if (t && !customTags.includes(t)) {
                     setCustomTags(prev => [...prev, t]);
                     setNewPostTag(t);
                   }
                 }}>
                   <Tag size={14} /> Add Tag
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   style={{ display: 'none' }} 
                   accept="image/*"
                   onChange={(e) => setAttachedFile(e.target.files[0])}
                 />
              </div>
            </div>
            
            <div className="rd-composer-footer">
              <button className="rd-cancel" onClick={() => setShowNewPost(false)}>Discard</button>
              <button className="rd-submit" onClick={handleCreatePost}>Publish Inquiry</button>
            </div>
          </div>
        ) : (
          <div className="rd-feed-body">
            {loading ? (
              <div className="rd-state-msg">
                <div className="elite-loader-wrap" style={{ padding: '20px 0' }}>
                  <div className="elite-spinner" style={{ width: '36px', height: '36px', borderWidth: '3px' }}></div>
                  <div className="elite-loader-text" style={{ fontSize: '0.8rem' }}>Syncing threads...</div>
                </div>
              </div>
            ) : posts.length > 0 ? posts.map(post => {
            const isLiked = post.likedBy?.includes(user?._id);
            return (
              <div key={post._id} className={`rd-scholarly-card ${post.tag === 'Error Help' ? 'error' : ''}`}>
                <div className={`rd-card-status ${post.tag?.toLowerCase().replace(/\s+/g, '-')}`}>
                   {post.tag === 'Error Help' ? 'LOGICAL PARADOX' : post.tag?.toUpperCase()}
                </div>
                <div className="rd-card-top">
                  <div className="rd-card-author">
                    <div className="rd-author-pic">
                      {post.author?.picture ? (
                        <img src={post.author.picture} alt={post.author.name} />
                      ) : (
                        getInitials(post.author?.name || post.authorName)
                      )}
                    </div>
                    <div>
                      <div className="rd-author-name">{post.author?.name || post.authorName}</div>
                      <div className="rd-author-role">{post.author?.role || 'Elite Member'} • {timeAgo(post.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="rd-card-body">
                  <h2 className="rd-card-title">{post.title || 'Inquiry Summary'}</h2>
                  <p className="rd-card-desc">{post.text}</p>
                  
                  {/* Attachment Handling */}
                  {post.tag === 'Error Help' ? (
                    <div className="rd-attachment-frame">
                      <div className="rd-frame-header">
                        <span>CONSENSUS_ENGINE.RS</span>
                        <span>Rust v1.74</span>
                      </div>
                      <div className="rd-frame-content">
                        {/* If image exists, show it, otherwise placeholder code visual */}
                        <div className="rd-img-wrap">
                           {post.image ? <img src={post.image} alt="Inquiry Attachment" /> : (
                             <pre className="rd-code-mock">
                               <code>{`async fn aggregate_weights\n  let\n  let handles: Vec<_>\n    // FIXME: Deadlock occurring here under heavy load\n       async move\n          await`}</code>
                             </pre>
                           )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    post.image && (
                      <div className="rd-standard-media">
                        <img src={post.image} alt="Inquiry media" />
                      </div>
                    )
                  )}
                </div>

                <div className="rd-card-footer">
                  <div className="rd-card-stats">
                    <button className={`rd-stat-btn ${isLiked ? 'active' : ''}`} onClick={() => handleToggleLike(post._id)}>
                       <ThumbsUp size={16} /> {post.likedBy?.length || 0}
                    </button>
                    <button className="rd-stat-btn" onClick={() => toggleReplies(post._id)}>
                       <MessageSquare size={16} /> {post.replies?.length || 0} Discussions
                    </button>
                    <button className="rd-stat-btn" onClick={() => showToast('Share link copied!')}>
                       <Share2 size={16} />
                    </button>
                  </div>
                </div>

                  {/* 🧵 THREADED REPLIES */}
                  {openReplies[post._id] && (
                    <div className="rd-thread-space">
                      {post.replies?.map((reply, i) => {
                        const isReplyLiked = reply.likedBy?.includes(user._id);
                        return (
                          <div key={i} className="rd-reply-item">
                            <div className="rd-reply-avatar-box">
                              {reply.author?.picture ? (
                                <img src={reply.author.picture} alt={reply.author.name} />
                              ) : (
                                getInitials(reply.author?.name || reply.authorName)
                              )}
                            </div>
                            <div className="rd-reply-bubble">
                              <div className="rd-reply-header">
                                <div className="rd-reply-user-info">
                                  <span className="rd-reply-user">{reply.author?.name || reply.authorName}</span>
                                  <span className="rd-reply-role">{reply.author?.role || 'Member'}</span>
                                </div>
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
                                 <button className="rd-reply-util" onClick={() => showToast('Nested replies coming soon!')}>Reply</button>
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
          </div>
        )}
      </div>
    )}
    </div>
    
    {toastMsg && (
      <div className="rd-toast">
        {toastMsg}
      </div>
    )}
  </div>
  );
}

