import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await api.post('/verify-otp', { email, otp });
  return response.data;
};

export const register = async (formData: FormData) => {
  const response = await api.post('/register', formData);
  return response.data;
};

export const deleteAccount = async (email: string) => {
  const response = await api.delete(`/delete-user/${encodeURIComponent(email)}`);
  return response.data;
};

export const getUserData = async (email: string) => {
  const response = await api.get(`/user/${encodeURIComponent(email)}`);
  return response.data;
};