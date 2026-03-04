import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onRegister, onSwitch }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate registration
        onRegister({ name, email });
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-blob auth-blob-1"></div>
                <div className="auth-blob auth-blob-2"></div>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">TG</div>
                    <h2 className="auth-title">Get Started</h2>
                    <p className="auth-subtitle">Join the future of collaborative research</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Alex Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth">Create Account</button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <span className="auth-toggle" onClick={onSwitch}>Sign In</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
