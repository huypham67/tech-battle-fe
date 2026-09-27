import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';
import { queryKeys } from '@/queries/queryKeys';
import type { BattleRoomEvent, BattleRoomResponse } from '@/types/battle';

function resolveWebSocketUrl(): string {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  const apiUrl = new URL(import.meta.env.VITE_API_URL ?? 'http://localhost:8080');
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  apiUrl.pathname = '/api/v1/ws';
  apiUrl.search = '';
  apiUrl.hash = '';
  return apiUrl.toString();
}

export function useBattleRoomSocket(sessionId: string | undefined) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!sessionId || !accessToken) {
      return undefined;
    }

    let active = true;
    const client = new Client({
      brokerURL: resolveWebSocketUrl(),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 3_000,
      onConnect: () => {
        if (!active) {
          return;
        }

        setIsConnected(true);
        client.subscribe(`/topic/battle/rooms/${sessionId}`, (message) => {
          try {
            const event = JSON.parse(message.body) as BattleRoomEvent;
            if (event.room) {
              queryClient.setQueryData<BattleRoomResponse>(
                queryKeys.battleRoom(sessionId),
                event.room,
              );
            }
          } catch {
            /* empty */
          }
        });
      },
      onDisconnect: () => {
        if (active) {
          setIsConnected(false);
        }
      },
      onWebSocketClose: () => {
        if (active) {
          setIsConnected(false);
        }
      },
      onStompError: () => {
        if (active) {
          setIsConnected(false);
        }
      },
    });

    client.activate();

    return () => {
      active = false;
      setIsConnected(false);
      void client.deactivate();
    };
  }, [queryClient, sessionId]);

  return { isConnected };
}
