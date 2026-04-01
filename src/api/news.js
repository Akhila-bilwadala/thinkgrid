import client from './client';

export const getTechNews = async () => {
    const { data } = await client.get('/news');
    return data;
};

export const updateTechNews = async (newsArray) => {
    const { data } = await client.post('/news/update', { news: newsArray });
    return data;
};
