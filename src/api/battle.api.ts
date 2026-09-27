import { apiClient } from '@/api/core/client';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { ApiResult } from '@/types';
import type {
  BattleRoomResponse,
  CreateBattleRoomRequest,
  JoinBattleRoomRequest,
} from '@/types/battle';

export async function createBattleRoom(
  payload: CreateBattleRoomRequest,
): Promise<BattleRoomResponse> {
  const response = await apiClient.post<ApiResult<BattleRoomResponse>>(
    ENDPOINTS.battleRooms,
    payload,
  );

  return response.data.data;
}

export async function getBattleRoom(sessionId: string): Promise<BattleRoomResponse> {
  const response = await apiClient.get<ApiResult<BattleRoomResponse>>(
    ENDPOINTS.battleRoom(sessionId),
  );

  return response.data.data;
}

export async function joinBattleRoom(payload: JoinBattleRoomRequest): Promise<BattleRoomResponse> {
  const response = await apiClient.post<ApiResult<BattleRoomResponse>>(
    ENDPOINTS.joinBattleRoom,
    payload,
  );

  return response.data.data;
}

export async function setBattleReady(
  sessionId: string,
  ready: boolean,
): Promise<BattleRoomResponse> {
  const response = await apiClient.post<ApiResult<BattleRoomResponse>>(
    ENDPOINTS.battleReady(sessionId),
    { ready },
  );

  return response.data.data;
}

export async function leaveBattleRoom(sessionId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.leaveBattleRoom(sessionId));
}

export async function startBattleRoom(sessionId: string): Promise<BattleRoomResponse> {
  const response = await apiClient.post<ApiResult<BattleRoomResponse>>(
    ENDPOINTS.startBattleRoom(sessionId),
  );

  return response.data.data;
}

export async function cancelBattleRoom(sessionId: string): Promise<BattleRoomResponse> {
  const response = await apiClient.post<ApiResult<BattleRoomResponse>>(
    ENDPOINTS.cancelBattleRoom(sessionId),
  );

  return response.data.data;
}
