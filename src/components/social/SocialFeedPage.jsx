import React from 'react';
import LeftSidebar from './LeftSidebar';
import FeedCenter from './FeedCenter';
import RightSidebar from './RightSidebar';
import './SocialFeed.css';

export default function SocialFeedPage() {
    return (
        <div className="sf-root">
            <LeftSidebar />
            <FeedCenter />
            <RightSidebar />
        </div>
    );
}
