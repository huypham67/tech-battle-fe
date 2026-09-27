import { useQuery } from '@tanstack/react-query';
import { getTopic, getTopicTree } from '@/api/topics.api';
import { queryKeys } from '@/queries/queryKeys';

export function useTopicTreeQuery() {
  return useQuery({
    queryKey: queryKeys.topicTree,
    queryFn: getTopicTree,
  });
}

export function useTopicQuery(topicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.topic(topicId ?? ''),
    queryFn: () => getTopic(topicId as string),
    enabled: Boolean(topicId),
  });
}
