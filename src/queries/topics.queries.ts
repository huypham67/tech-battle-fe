import { useQuery } from '@tanstack/react-query';
import { fetchTopicTree } from '@/api/topics.api';
import { queryKeys } from '@/queries/queryKeys';

export function useTopicTreeQuery() {
  return useQuery({
    queryKey: queryKeys.topicTree,
    queryFn: fetchTopicTree,
  });
}
