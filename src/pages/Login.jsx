import React, { useState } from 'react';
import './Auth.css';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';

const Login = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginApi({ email, password });
            loginUser(data);
        } catch (err) {
            console.error('Login error:', err);
            if (!err.response) {
                setError('Network error: Cannot reach the backend. Check VITE_API_URL.');
            } else {
                setError(err.response?.data?.error || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-tl" />
            <div className="auth-blob auth-blob-br" />

            <div className="auth-card-new">
                <div className="auth-card-header">
                    <h1 className="auth-card-title">Sign in</h1>
                    <p className="auth-card-sub">Welcome back to ThinkGrid!</p>
                </div>

                <div className="auth-form-new">
                    <form onSubmit={handleSubmit}>
                        {error && <div className="auth-error-msg">{error}</div>}

                        <div className="auth-field">
                            <label>Email</label>
                            <div className="auth-input-line">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    required
                                />
                                {email && <span className="field-check">✓</span>}
                            </div>
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <div className="auth-input-line">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    required
                                />
                                {password && <span className="field-check">✓</span>}
                            </div>
                        </div>

                        <button type="submit" className="btn-auth-submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="auth-switch-line">
                    New to ThinkGrid? <span className="auth-switch-link" onClick={onSwitch}>Sign up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
