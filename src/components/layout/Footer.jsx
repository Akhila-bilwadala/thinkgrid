import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand-section">
                    <div className="footer-logo">TG</div>
                    <p className="footer-mission">
                        Empowering the next generation of researchers and creators through collaborative learning and high-fidelity project labs.
                    </p>
                    <div className="footer-socials">
                        <a href="#github" className="social-link">GH</a>
                        <a href="#twitter" className="social-link">TW</a>
                        <a href="#discord" className="social-link">DC</a>
                    </div>
                </div>

                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h6>Platform</h6>
                        <a href="#explore">Explore</a>
                        <a href="#labs">Project Labs</a>
                        <a href="#rooms">Rooms</a>
                        <a href="#materials">Materials</a>
                    </div>
                    <div className="footer-column">
                        <h6>Community</h6>
                        <a href="#help">Help Center</a>
                        <a href="#guidelines">Guidelines</a>
                        <a href="#events">Events</a>
                    </div>
                    <div className="footer-column">
                        <h6>Legal</h6>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#cookie">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
