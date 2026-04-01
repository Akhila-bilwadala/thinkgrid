import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── API BASE CONFIGURATION ───
const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── AXIOS INTERCEPTOR: AUTH & HEADERS ───
client.interceptors.request.use((config) => {
    // Check for standard user token first, then fallback to adminToken
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Let browser set the content-type automatically for FormData (with boundary)
    if (config.data instanceof FormData) {
        if (config.headers.delete) {
          config.headers.delete('Content-Type');
        } else {
          delete config.headers['Content-Type'];
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default client;
