import React, { useState } from 'react';
import './Auth.css';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api/auth';

const Register = ({ onSwitch }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [institution, setInstitution] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await registerApi({ 
                name, 
                email, 
                password, 
                role, 
                company: institution 
            });
            loginUser(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-tl" />
            <div className="auth-blob auth-blob-br" />
            <div className="auth-blob auth-blob-tr" />

            <div className="auth-card-new">
                <div className="auth-card-header">
                    <h1 className="auth-card-title">Sign up</h1>
                    <p className="auth-card-sub">Join the ThinkGrid community today!</p>
                </div>

                <div className="auth-form-new">
                    <form onSubmit={handleSubmit}>
                        {error && <div className="auth-error-msg">{error}</div>}

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
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    required
                                />
                                {password && <span className="field-check">✓</span>}
                            </div>
                        </div>

                        <div className="auth-row">
                            <div className="auth-field">
                                <label>Current Role</label>
                                <div className="auth-input-line">
                                    <select 
                                        value={role} 
                                        onChange={e => setRole(e.target.value)}
                                        className="auth-select-input"
                                        required
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Working Professional">Working Professional</option>
                                    </select>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label>{role === 'Student' ? 'College / University' : 'Company Name'}</label>
                                <div className="auth-input-line">
                                    <input
                                        type="text"
                                        placeholder={role === 'Student' ? "e.g. Stanford University" : "e.g. Google"}
                                        value={institution}
                                        onChange={e => setInstitution(e.target.value)}
                                        required
                                    />
                                    {institution && <span className="field-check">✓</span>}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-auth-submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>
                </div>

                <p className="auth-switch-line">
                    Already a member? <span className="auth-switch-link" onClick={onSwitch}>Sign in</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
