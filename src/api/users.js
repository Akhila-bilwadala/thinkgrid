import client from './client';

export const getProfile = async () => {
    const { data } = await client.get('/users/profile');
    return data;
};

export const updateProfile = async (profileData) => {
    const { data } = await client.put('/users/profile', profileData);
    return data;
};

export const uploadProfilePicture = async (base64Data) => {
    const { data } = await client.put('/users/profile/picture', { picture: base64Data });
    return data;
};

export const uploadBgPicture = async (base64Data) => {
    const { data } = await client.put('/users/profile/bgpicture', { bgPicture: base64Data });
    return data;
};

export const getAllUsers = async () => {
    const { data } = await client.get('/users');
    return data;
};

export const getUserById = async (id) => {
    const { data } = await client.get(`/users/${id}`);
    return data;
};
