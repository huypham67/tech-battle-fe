import { apiClient } from '@/api/core/client';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { ApiResult } from '@/types';
import type { TopicResponse, TopicTreeResponse } from '@/types/topic';

export async function getTopics(): Promise<TopicResponse[]> {
  const response = await apiClient.get<ApiResult<TopicResponse[]>>(ENDPOINTS.topics);

  return response.data.data;
}

export async function getTopicTree(): Promise<TopicTreeResponse[]> {
  const response = await apiClient.get<ApiResult<TopicTreeResponse[]>>(ENDPOINTS.topicTree);

  return response.data.data;
}

export async function getTopic(topicId: string): Promise<TopicResponse> {
  const response = await apiClient.get<ApiResult<TopicResponse>>(ENDPOINTS.topic(topicId));

  return response.data.data;
}
