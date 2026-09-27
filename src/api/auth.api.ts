import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/auth';
import { apiClient } from '@/api/core/client';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { ApiResult } from '@/types';

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResult<TokenResponse>>(ENDPOINTS.login, payload);

  return response.data.data;
}

export async function register(payload: RegisterRequest): Promise<UserResponse> {
  const response = await apiClient.post<ApiResult<UserResponse>>(ENDPOINTS.register, payload);

  return response.data.data;
}
