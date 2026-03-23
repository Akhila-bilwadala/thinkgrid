import API from './client';

export const createExchangeRequest = async (data) => {
  const response = await API.post('/exchanges', data);
  return response.data;
};

export const getMyExchanges = async () => {
  const response = await API.get('/exchanges/my');
  return response.data;
};

export const updateExchangeStatus = async (id, data) => {
  const response = await API.put(`/exchanges/${id}`, data);
  return response.data;
};
