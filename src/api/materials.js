import client from './client';

export const getMaterials = async () => {
    const { data } = await client.get('/materials');
    return data;
};

export const saveMaterial = async (id) => {
    const { data } = await client.post(`/materials/${id}/save`);
    return data;
};

export const unsaveMaterial = async (id) => {
    const { data } = await client.post(`/materials/${id}/unsave`);
    return data;
};

export const uploadMaterial = async (materialData) => {
    const { data } = await client.post('/materials', materialData);
    return data;
};
