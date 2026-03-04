import React from 'react';
import Sidebar from './Sidebar';
import { Search, TrendingUp, Users as UsersIcon } from 'lucide-react';
import './Layout.css';

const Layout = ({ children, currentTab, onNavigate }) => {
    return (
        <div className="layout-root">
            <Sidebar currentTab={currentTab} onNavigate={onNavigate} />

            <main className="main-viewport">
                <div className="viewport-inner">
                    {children}
                </div>
            </main>

            <aside className="right-panel-v2">
                <div className="search-bar-v2 glass">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search ThinkGrid..." />
                </div>

                <div className="panel-section glass">
                    <div className="section-header">
                        <TrendingUp size={18} className="icon-blue" />
                        <h3>Trending Skills</h3>
                    </div>
                    <div className="trending-chips">
                        <span className="skill-chip">#SystemDesign</span>
                        <span className="skill-chip">#React2026</span>
                        <span className="skill-chip">#AIForDevs</span>
                        <span className="skill-chip">#CloudArch</span>
                        <span className="skill-chip">#DSAPro</span>
                    </div>
                    <button className="view-more">Explore all skills</button>
                </div>

                <div className="panel-section glass">
                    <div className="section-header">
                        <UsersIcon size={18} className="icon-purple" />
                        <h3>Suggested Mentors</h3>
                    </div>
                    <div className="mentor-list">
                        <div className="mentor-item">
                            <div className="mentor-avatar">DV</div>
                            <div className="mentor-info">
                                <span className="mentor-name">Dr. Sarah Venn</span>
                                <span className="mentor-title">DBMS Professor</span>
                            </div>
                            <button className="mentor-action">Connect</button>
                        </div>
                        <div className="mentor-item">
                            <div className="mentor-avatar">JW</div>
                            <div className="mentor-info">
                                <span className="mentor-name">James Wilson</span>
                                <span className="mentor-title">Senior ML Eng.</span>
                            </div>
                            <button className="mentor-action">Connect</button>
                        </div>
                    </div>
                </div>

                <footer className="right-panel-footer">
                    <div className="footer-links">
                        <span>About</span>
                        <span>Terms</span>
                        <span>Privacy</span>
                    </div>
                    <p>© 2026 ThinkGrid Platform</p>
                </footer>
            </aside>
        </div>
    );
};

export default Layout;
