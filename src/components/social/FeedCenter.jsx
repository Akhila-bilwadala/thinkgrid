import React from 'react';
import PostCard from './PostCard';

const POSTS = [
    {
        id: 1,
        author: { name: 'George Lobko', avatar: '/bogdan.png' },
        time: '2 hours ago',
        body: (
            <>
                Hi everyone, today I was on the most beautiful mountain in the world 🤩, I also
                want to say hi to{' '}
                <span className="sf-mention">🌸 Silena</span>,{' '}
                <span className="sf-mention">🌺 Olya</span> and{' '}
                <span className="sf-mention">🌟 Davis</span>!
            </>
        ),
        images: ['/hiking.png', '/flower.png', '/mountain.png'],
        reactions: ['🔥', '😊', '❤️'],
        showWow: true,
        views: 6355,
    },
    {
        id: 2,
        author: { name: 'Vitaliy Boyko', avatar: '/story_desert.png' },
        time: '3 hours ago',
        bgClass: 'bg-peach',
        body: (
            <>
                I chose a wonderful coffee today, I wanted to tell you what product they have
                in stock - it&apos;s a latte with coconut 🥥 milk... delicious... it&apos;s really incredibly
                tasty!!! 😍
            </>
        ),
        images: [],
        views: 6355,
    },
];

export default function FeedCenter() {
    const [activeTab, setActiveTab] = React.useState('Friends');
    const tabs = ['Recents', 'Friends', 'Popular'];

    return (
        <main className="sf-center">
            <div className="sf-feeds-header">
                <h1 className="sf-feeds-title">Feeds</h1>
                <div className="sf-tabs">
                    {tabs.map(t => (
                        <button
                            key={t}
                            className={`sf-tab${activeTab === t ? ' active' : ''}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {POSTS.map(post => (
                <PostCard key={post.id} post={post} />
            ))}

            {/* Share bar */}
            <div className="sf-post" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="sf-share-bar">
                    <img className="sf-post-avatar" src="/bogdan.png" alt="" style={{ margin: 0 }} />
                    <input type="text" placeholder="Share something..." />
                    <span className="sf-share-icon">😊</span>
                </div>
                <div className="sf-post-actions">
                    <button className="sf-action-btn">📎 File</button>
                    <button className="sf-action-btn">🖼️ Image</button>
                    <button className="sf-action-btn">📍 Location</button>
                    <div className="sf-public-select">
                        <button className="sf-action-btn">🌐 Public ▾</button>
                    </div>
                    <button className="sf-send-btn">Send</button>
                </div>
            </div>
        </main>
    );
}
