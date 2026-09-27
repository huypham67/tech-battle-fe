export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  modeSelect: '/topics/:topicId/mode',
  practiceSetup: '/topics/:topicId/practice/setup',
  practiceSession: '/practice/sessions/:sessionId',
  practiceResult: '/practice/sessions/:sessionId/result',
  battleCreate: '/topics/:topicId/battle/create',
  battleRoom: '/battle/rooms/:sessionId',
} as const;

export const buildRoute = {
  modeSelect: (topicId: string) => `/topics/${topicId}/mode`,
  practiceSetup: (topicId: string) => `/topics/${topicId}/practice/setup`,
  practiceSession: (sessionId: string) => `/practice/sessions/${sessionId}`,
  practiceResult: (sessionId: string) => `/practice/sessions/${sessionId}/result`,
  battleCreate: (topicId: string) => `/topics/${topicId}/battle/create`,
  battleRoom: (sessionId: string) => `/battle/rooms/${sessionId}`,
} as const;
