import type { ApiResult } from '@/types';
import type { UpdateProfileRequest, UserResponse } from '@/types/auth';
import { apiClient } from '@/api/core/client';
import { ENDPOINTS } from '@/api/core/endpoints';

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiClient.get<ApiResult<UserResponse>>(ENDPOINTS.me);

  return response.data.data;
}

export async function updateCurrentProfile(payload: UpdateProfileRequest): Promise<UserResponse> {
  const response = await apiClient.patch<ApiResult<UserResponse>>(ENDPOINTS.me, payload);

  return response.data.data;
}
