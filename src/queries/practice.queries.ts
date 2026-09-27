import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPracticeSession,
  getPracticeResult,
  getPracticeSession,
  submitPracticeAnswer,
} from '@/api/practice.api';
import { queryKeys } from '@/queries/queryKeys';
import type { SubmitPracticeAnswerRequest } from '@/types/practice';

export function useCreatePracticeSessionMutation() {
  return useMutation({
    mutationFn: createPracticeSession,
  });
}

export function usePracticeSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.practiceSession(sessionId ?? ''),
    queryFn: () => getPracticeSession(sessionId as string),
    enabled: Boolean(sessionId),
    retry: false,
  });
}

export function useSubmitPracticeAnswerMutation(sessionId: string) {
  return useMutation({
    mutationFn: (payload: SubmitPracticeAnswerRequest) => submitPracticeAnswer(sessionId, payload),
  });
}

export function usePracticeResultQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.practiceResult(sessionId ?? ''),
    queryFn: () => getPracticeResult(sessionId as string),
    enabled: Boolean(sessionId),
    retry: false,
  });
}
