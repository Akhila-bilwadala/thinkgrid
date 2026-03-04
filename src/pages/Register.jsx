import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onRegister, onSwitch }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister({ name, email });
    };

    return (
        <div className="auth-page">
            {/* Background decorative blobs */}
            <div className="auth-blob auth-blob-tl" />
            <div className="auth-blob auth-blob-br" />
            <div className="auth-blob auth-blob-tr" />

            {/* Card */}
            <div className="auth-card-new">
                <div className="auth-card-header">
                    <h1 className="auth-card-title">Sign up</h1>
                    <p className="auth-card-sub">Join the ThinkGrid community today!</p>
                </div>

                {/* Google Button */}
                <button className="btn-google-auth">
                    <span className="google-icon">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                    </span>
                    Use Google account
                </button>

                <div className="auth-or-divider">
                    <span>or</span>
                </div>

                <form className="auth-form-new" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label>Full Name</label>
                        <div className="auth-input-line">
                            <input
                                type="text"
                                placeholder="Alex Smith"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            {name && <span className="field-check">✓</span>}
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Email</label>
                        <div className="auth-input-line">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            {email && <span className="field-check">✓</span>}
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <div className="auth-input-line">
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            {password && <span className="field-check">✓</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn-auth-submit">
                        Sign up
                    </button>
                </form>

                <p className="auth-switch-line">
                    Already a member? <span className="auth-switch-link" onClick={onSwitch}>Sign in</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
