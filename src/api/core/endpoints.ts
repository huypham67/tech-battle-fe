const API_PREFIX = '/api/v1';

export const ENDPOINTS = {
  topics: `${API_PREFIX}/topics`,
  topicTree: `${API_PREFIX}/topics/tree`,
  topic: (topicId: string) => `${API_PREFIX}/topics/${topicId}`,
  login: `${API_PREFIX}/auth/login`,
  register: `${API_PREFIX}/auth/register`,
  refresh: `${API_PREFIX}/auth/refresh`,
  logout: `${API_PREFIX}/auth/logout`,
  me: `${API_PREFIX}/users/me`,
} as const;
