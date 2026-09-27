export const queryKeys = {
  currentUser: ['current-user'] as const,
  topics: ['topics'] as const,
  topicTree: ['topics', 'tree'] as const,
  topic: (topicId: string) => ['topics', topicId] as const,
  practiceSession: (sessionId: string) => ['practice', 'sessions', sessionId] as const,
  practiceResult: (sessionId: string) => ['practice', 'sessions', sessionId, 'result'] as const,
} as const;
