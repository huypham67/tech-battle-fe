import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register } from '@/api/auth.api';
import { getCurrentUser, updateCurrentProfile } from '@/api/users.api';
import { getAccessToken } from '@/lib/auth';
import { queryKeys } from '@/queries/queryKeys';

export function useCurrentUserQuery() {
  const token = getAccessToken();

  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    retry: false,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function useUpdateCurrentProfileMutation() {
  return useMutation({
    mutationFn: updateCurrentProfile,
  });
}
