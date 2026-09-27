export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  modeSelect: '/topics/:topicId/mode',
  practiceSetup: '/topics/:topicId/practice/setup',
  practiceSession: '/practice/sessions/:sessionId',
  practiceResult: '/practice/sessions/:sessionId/result',
} as const;

export const buildRoute = {
  modeSelect: (topicId: string) => `/topics/${topicId}/mode`,
  practiceSetup: (topicId: string) => `/topics/${topicId}/practice/setup`,
  practiceSession: (sessionId: string) => `/practice/sessions/${sessionId}`,
  practiceResult: (sessionId: string) => `/practice/sessions/${sessionId}/result`,
} as const;
