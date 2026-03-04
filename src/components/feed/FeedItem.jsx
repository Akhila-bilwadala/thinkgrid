import React from 'react';
import { MessageCircle, ThumbsUp, Share2, MoreHorizontal, CheckCircle } from 'lucide-react';
import './FeedItem.css';

const FeedItem = ({ item }) => {
    const isQuestion = item.type === 'question';
    const isProfessor = item.author.role === 'Professor';

    return (
        <article className="feed-item-v2 premium-card">
            <div className="feed-item-header">
                <div className="author-info">
                    <div className={`author-avatar-v2 ${isProfessor ? 'professor' : ''}`}>
                        {item.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="author-text">
                        <span className="author-name">
                            {item.author.name}
                            {isProfessor && <CheckCircle size={14} className="verified-icon" />}
                        </span>
                        <span className="author-meta">{item.author.role} • {item.timestamp}</span>
                    </div>
                </div>
                <button className="more-btn">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="feed-item-content">
                <div className={`type-tag ${item.type}`}>
                    {item.type === 'question' ? 'Question' : 'Study Material'}
                </div>
                <h3 className="feed-title">{item.title}</h3>
                <p className="feed-snippet">{item.content}</p>

                <div className="feed-tags-list">
                    {item.tags.map((tag, idx) => (
                        <span key={idx} className="content-tag">#{tag}</span>
                    ))}
                </div>
            </div>

            <div className="feed-item-footer">
                <div className="footer-actions">
                    <button className="action-btn">
                        <ThumbsUp size={18} />
                        <span>{item.stats.upvotes}</span>
                    </button>
                    <button className="action-btn">
                        <MessageCircle size={18} />
                        <span>{item.stats.comments}</span>
                    </button>
                    <button className="action-btn">
                        <Share2 size={18} />
                    </button>
                </div>
                <button className="help-btn">
                    {isQuestion ? 'Answer Question' : 'Download Material'}
                </button>
            </div>
        </article>
    );
};

export default FeedItem;
