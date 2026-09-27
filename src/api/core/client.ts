import axios, { AxiosError } from 'axios';
import { clearAccessToken, getAccessToken } from '@/lib/auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      clearAccessToken();
    }

    const message = error.response?.data?.message || error.message || 'Network error';

    return Promise.reject(new Error(message));
  },
);
