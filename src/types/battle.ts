import type { Difficulty, SessionStatus } from '@/types/practice';

export type SessionVisibility = 'PUBLIC' | 'PRIVATE';
export type PlayerRole = 'HOST' | 'PLAYER';

export interface CreateBattleRoomRequest {
  topicId: string;
  difficulty: Difficulty;
  questionCount: number;
  timePerQuestion: number;
  maxPlayers: number;
  visibility: SessionVisibility;
}

export interface JoinBattleRoomRequest {
  sessionCode: string;
}

export interface BattlePlayerResponse {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: PlayerRole;
  ready: boolean;
  finalScore: number | null;
  finalRank: number | null;
}

export interface BattleRoomResponse {
  id: string;
  sessionCode: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  questionCount: number;
  timePerQuestion: number;
  maxPlayers: number;
  visibility: SessionVisibility;
  status: SessionStatus;
  createdBy: string;
  startedAt: string | null;
  finishedAt: string | null;
  players: BattlePlayerResponse[];
}

export interface BattleRoomEvent {
  type: string;
  room: BattleRoomResponse;
  actorUserId: string;
  occurredAt: string;
}
