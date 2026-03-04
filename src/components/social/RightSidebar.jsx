import React from 'react';

const SUGGESTIONS = [
    { name: 'Nick Shelburne', initials: 'NS', color: '#e0d7ff' },
    { name: 'Brittni Lando', initials: 'BL', color: '#ffddf0' },
    { name: 'Ivan Shevchenko', initials: 'IS', color: '#d7f0ff' },
];

const RECOS = [
    { label: 'UI/UX', icon: '✕', overlay: 'linear-gradient(135deg, #c8c8e8, #9090c8)' },
    { label: 'Music', icon: '🎵', overlay: 'linear-gradient(135deg, #ff6bbd, #ff4d9d)', img: '/flower.png' },
    { label: 'Cooking', icon: '🍳', overlay: 'linear-gradient(135deg, #ffd07a, #ffb03a)', img: '/hiking.png' },
    { label: 'Hiking', icon: '⛰️', overlay: 'linear-gradient(135deg, #a259ff, #7c4dff)', img: '/mountain.png' },
];

export default function RightSidebar() {
    return (
        <aside className="sf-right">
            {/* Stories */}
            <div>
                <div className="sf-section-title">Stories</div>
                <div className="sf-stories">
                    <div className="sf-story-card">
                        <img src="/story_desert.png" alt="Story" />
                        <div className="sf-story-label">Anatoly Pr...</div>
                    </div>
                    <div className="sf-story-card">
                        <img src="/story_beach.png" alt="Story" />
                        <div className="sf-story-label">Lolita Earns</div>
                    </div>

                    {/* floating avatar */}
                    <div className="sf-story-avatar-float">
                        <img src="/bogdan.png" alt="" />
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div>
                <div className="sf-section-title">Suggestions</div>
                {SUGGESTIONS.map(s => (
                    <div key={s.name} className="sf-suggestion-item">
                        <div
                            className="sf-sugg-avatar"
                            style={{ background: s.color }}
                        >
                            {s.initials}
                        </div>
                        <div className="sf-sugg-info">
                            <div className="sf-sugg-name">{s.name.split(' ')[0]}</div>
                            <div className="sf-sugg-role">{s.name.split(' ')[1]}</div>
                        </div>
                        <button className="sf-follow-btn">Follow</button>
                    </div>
                ))}
                <a className="sf-see-all">See all</a>
            </div>

            {/* Recommendations */}
            <div>
                <div className="sf-section-title">Recommendations</div>
                <div className="sf-reco-grid">
                    {RECOS.map(r => (
                        <div key={r.label} className="sf-reco-card">
                            {r.img && <img src={r.img} alt={r.label} />}
                            <div
                                className="sf-reco-overlay"
                                style={{ background: r.overlay, opacity: r.img ? 0.75 : 1 }}
                            />
                            <div className="sf-reco-label">
                                <span className="sf-reco-icon">{r.icon}</span>
                                {r.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
