import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getPendingItems = async () => {
  const response = await axios.get(`${API_URL}/admin/pending`, getAuthHeader());
  return response.data;
};

export const approveItem = async (type, id) => {
  const response = await axios.patch(`${API_URL}/admin/approve/${type}/${id}`, {}, getAuthHeader());
  return response.data;
};

export const rejectItem = async (type, id) => {
  const response = await axios.delete(`${API_URL}/admin/reject/${type}/${id}`, getAuthHeader());
  return response.data;
};
