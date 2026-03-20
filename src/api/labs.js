import client from './client';

export const getLabs = async () => {
    const { data } = await client.get('/labs');
    return data;
};

export const createLab = async (labData) => {
    const { data } = await client.post('/labs', labData);
    return data;
};
