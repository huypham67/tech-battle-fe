import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelBattleRoom,
  createBattleRoom,
  getBattleRoom,
  joinBattleRoom,
  leaveBattleRoom,
  setBattleReady,
  startBattleRoom,
} from '@/api/battle.api';
import { queryKeys } from '@/queries/queryKeys';
import type { CreateBattleRoomRequest, JoinBattleRoomRequest } from '@/types/battle';

export function useCreateBattleRoomMutation() {
  return useMutation({
    mutationFn: createBattleRoom,
  });
}

export function useJoinBattleRoomMutation() {
  return useMutation({
    mutationFn: (payload: JoinBattleRoomRequest) => joinBattleRoom(payload),
  });
}

export function useBattleRoomQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.battleRoom(sessionId ?? ''),
    queryFn: () => getBattleRoom(sessionId as string),
    enabled: Boolean(sessionId),
    retry: false,
  });
}

export function useSetBattleReadyMutation(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ready: boolean) => setBattleReady(sessionId, ready),
    onSuccess: (room) => {
      queryClient.setQueryData(queryKeys.battleRoom(sessionId), room);
    },
  });
}

export function useLeaveBattleRoomMutation() {
  return useMutation({
    mutationFn: (sessionId: string) => leaveBattleRoom(sessionId),
  });
}

export function useStartBattleRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => startBattleRoom(sessionId),
    onSuccess: (room, sessionId) => {
      queryClient.setQueryData(queryKeys.battleRoom(sessionId), room);
    },
  });
}

export function useCancelBattleRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => cancelBattleRoom(sessionId),
    onSuccess: (room, sessionId) => {
      queryClient.setQueryData(queryKeys.battleRoom(sessionId), room);
    },
  });
}

export type { CreateBattleRoomRequest };
