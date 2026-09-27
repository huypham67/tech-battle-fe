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
  practiceSessions: `${API_PREFIX}/practice/sessions`,
  practiceSession: (sessionId: string) => `${API_PREFIX}/practice/sessions/${sessionId}`,
  practiceAnswers: (sessionId: string) => `${API_PREFIX}/practice/sessions/${sessionId}/answers`,
  practiceResult: (sessionId: string) => `${API_PREFIX}/practice/sessions/${sessionId}/result`,
  battleRooms: `${API_PREFIX}/battle/rooms`,
  battleRoom: (sessionId: string) => `${API_PREFIX}/battle/rooms/${sessionId}`,
  joinBattleRoom: `${API_PREFIX}/battle/rooms/join`,
  battleReady: (sessionId: string) => `${API_PREFIX}/battle/rooms/${sessionId}/ready`,
  leaveBattleRoom: (sessionId: string) => `${API_PREFIX}/battle/rooms/${sessionId}/players/me`,
  startBattleRoom: (sessionId: string) => `${API_PREFIX}/battle/rooms/${sessionId}/start`,
  cancelBattleRoom: (sessionId: string) => `${API_PREFIX}/battle/rooms/${sessionId}/cancel`,
} as const;
