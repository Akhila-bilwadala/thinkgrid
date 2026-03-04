import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Specific demo credentials check
        if (email === 'admin@thinkgrid.com' && password === 'tg2026') {
            onLogin({ name: 'Alex Smith', email });
        } else {
            setError('Invalid credentials. Hint: admin@thinkgrid.com / tg2026');
        }
    };

    return (
        <div className="auth-container tract-style">
            <div className="auth-topo-bg"></div>

            <header className="auth-nav">
                <div className="auth-nav-logo">Think<span>Grid.</span></div>
                <div className="auth-nav-actions">
                    <button className="btn-nav-search">🔍</button>
                    <button className="btn-signup-nav" onClick={onSwitch}>Sign up</button>
                </div>
            </header>

            <main className="auth-main">
                <div className="auth-content-header">
                    <h1 className="auth-hero-title">Login to Your Account</h1>
                    <p className="auth-hero-subtitle">Access your collaborative labs and research materials instantly.</p>
                </div>

                <div className="auth-split-grid">
                    <div className="auth-left">
                        <form className="auth-form-tract" onSubmit={handleSubmit}>
                            {error && <div className="auth-error-hint" style={{ color: '#FF3E6C', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
                            <div className="tract-input-group">
                                <input
                                    type="text"
                                    placeholder="Email / Username"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    required
                                />
                                <span className="tract-input-icon">👤</span>
                            </div>

                            <div className="tract-input-group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    required
                                />
                                <span className="tract-input-icon">👁️</span>
                            </div>

                            <button type="submit" className="btn-tract-login">
                                Login to Your Account
                                <span className="btn-arrow">→</span>
                            </button>
                        </form>
                    </div>

                    <div className="auth-divider">
                        <span>/</span>
                    </div>

                    <div className="auth-right">
                        <div className="social-logins">
                            <button className="btn-social google">
                                <span className="social-icon">G</span>
                                Sign in with Google
                            </button>
                            <button className="btn-social facebook">
                                <span className="social-icon">F</span>
                                Sign in with Facebook
                            </button>
                            <button className="btn-social apple">
                                <span className="social-icon"></span>
                                Sign in with Apple Account
                            </button>
                        </div>
                    </div>
                </div>

                <div className="auth-tract-footer">
                    <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: '8px' }}>Demo: admin@thinkgrid.com / tg2026</p>
                    <span className="forgot-pass-tract">Forgot Password?</span>
                </div>
            </main>
        </div>
    );
};

export default Login;
