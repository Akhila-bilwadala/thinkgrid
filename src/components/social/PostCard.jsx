import React, { useState } from 'react';

export default function PostCard({ post }) {
    const [liked, setLiked] = useState(false);
    const [showWow, setShowWow] = useState(post.showWow || false);

    return (
        <article className={`sf-post${post.bgClass ? ` ${post.bgClass}` : ''}`}>
            <div className="sf-post-header">
                <img
                    className="sf-post-avatar"
                    src={post.author.avatar}
                    alt={post.author.name}
                />
                <div>
                    <div className="sf-post-author">{post.author.name}</div>
                    <div className="sf-post-time">{post.time}</div>
                </div>
                <button className="sf-post-more">⋯</button>
            </div>

            <div className="sf-post-body">
                {post.body}
            </div>

            {post.images && post.images.length > 0 && (
                <div className={`sf-post-images ${post.images.length === 1 ? 'single' : post.images.length === 2 ? 'two' : ''}`}>
                    {post.images.map((src, i) => (
                        <img key={i} className="sf-post-img" src={src} alt="" />
                    ))}
                </div>
            )}

            {post.reactions && (
                <div className="sf-reactions-row">
                    <span className="sf-emoji-stack">
                        {post.reactions.map((e, i) => <span key={i}>{e}</span>)}
                    </span>
                    {showWow && (
                        <div className="sf-wow-pill">
                            😲 Wooow!!
                            <span className="sf-wow-close" onClick={() => setShowWow(false)}>✕</span>
                        </div>
                    )}
                </div>
            )}

            <div className="sf-post-footer">
                <button className="sf-stat">
                    <span className="sf-stat-icon">👁️</span>
                    {post.views?.toLocaleString()}
                </button>
                <button
                    className="sf-stat"
                    onClick={() => setLiked(l => !l)}
                    style={liked ? { color: '#ff4d6a' } : {}}
                >
                    <span className="sf-stat-icon">👍</span> Like
                </button>
                <button className="sf-stat">
                    <span className="sf-stat-icon">💬</span> Comment
                </button>
            </div>
        </article>
    );
}
