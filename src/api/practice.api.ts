import { apiClient } from '@/api/core/client';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { ApiResult } from '@/types';
import type {
  CreatePracticeSessionRequest,
  PracticeAnswerResponse,
  PracticeResultResponse,
  PracticeSessionResponse,
  SubmitPracticeAnswerRequest,
} from '@/types/practice';

export async function createPracticeSession(
  payload: CreatePracticeSessionRequest,
): Promise<PracticeSessionResponse> {
  const response = await apiClient.post<ApiResult<PracticeSessionResponse>>(
    ENDPOINTS.practiceSessions,
    payload,
  );

  return response.data.data;
}

export async function getPracticeSession(sessionId: string): Promise<PracticeSessionResponse> {
  const response = await apiClient.get<ApiResult<PracticeSessionResponse>>(
    ENDPOINTS.practiceSession(sessionId),
  );

  return response.data.data;
}

export async function submitPracticeAnswer(
  sessionId: string,
  payload: SubmitPracticeAnswerRequest,
): Promise<PracticeAnswerResponse> {
  const response = await apiClient.post<ApiResult<PracticeAnswerResponse>>(
    ENDPOINTS.practiceAnswers(sessionId),
    payload,
  );

  return response.data.data;
}

export async function getPracticeResult(sessionId: string): Promise<PracticeResultResponse> {
  const response = await apiClient.get<ApiResult<PracticeResultResponse>>(
    ENDPOINTS.practiceResult(sessionId),
  );

  return response.data.data;
}
