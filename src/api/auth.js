import client from './client';

export const login = async (credentials) => {
    const { data } = await client.post('/auth/login', credentials);
    return data;
};

export const register = async (userData) => {
    const { data } = await client.post('/auth/register', userData);
    return data;
};

export const getMe = async () => {
    const { data } = await client.get('/auth/me');
    return data;
};

export const googleAuth = async (token) => {
    const { data } = await client.post('/auth/google', { access_token: token });
    return data;
};
