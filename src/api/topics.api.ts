import { getTopicTree } from '@/data/topics';
import type { TopicTreeNode } from '@/types';

export function fetchTopicTree(): Promise<TopicTreeNode[]> {
  return Promise.resolve(getTopicTree());
}
