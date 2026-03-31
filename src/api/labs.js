import client from './client';

export const getLabs = async () => {
    const { data } = await client.get('/labs');
    return data;
};

export const getMyLabs = async () => {
    const { data } = await client.get('/labs/my');
    return data;
};

export const createLab = async (labData) => {
    const { data } = await client.post('/labs', labData);
    return data;
};

export const joinLab = async (id) => {
    const { data } = await client.post(`/labs/join/${id}`);
    return data;
};

export const approveLabMember = async (id, userId) => {
    const { data } = await client.patch(`/labs/approve/${id}/${userId}`);
    return data;
};
