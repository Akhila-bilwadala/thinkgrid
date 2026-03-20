import client from './client';

export const getRooms = async () => {
    const { data } = await client.get('/rooms');
    return data;
};

export const joinRoom = async (id) => {
    const { data } = await client.post(`/rooms/${id}/join`);
    return data;
};

export const leaveRoom = async (id) => {
    const { data } = await client.post(`/rooms/${id}/leave`);
    return data;
};

export const createRoom = async (roomData) => {
    const { data } = await client.post('/rooms', roomData);
    return data;
};

export const getRoom = async (id) => {
    const { data } = await client.get(`/rooms/${id}`);
    return data;
};
