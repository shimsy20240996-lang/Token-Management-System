import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getServices = async () => {
  const res = await api.get('/services');
  return res.data;
};

export const generateToken = async (data: { name: string; phoneNumber: string; language: string; serviceId: string }) => {
  const res = await api.post('/tokens/generate', data);
  return res.data;
};

export const trackToken = async (tokenNumber: string) => {
  const res = await api.get(`/tokens/track/${tokenNumber}`);
  return res.data;
};
