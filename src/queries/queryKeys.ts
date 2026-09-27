export const queryKeys = {
  currentUser: ['current-user'] as const,
  topics: ['topics'] as const,
  topicTree: ['topics', 'tree'] as const,
  topic: (topicId: string) => ['topics', topicId] as const,
} as const;
