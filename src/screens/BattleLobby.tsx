import {
  ArrowLeft,
  Check,
  Copy,
  Crown,
  DoorOpen,
  Play,
  RefreshCw,
  Swords,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBattleRoomSocket } from '@/hooks/useBattleRoomSocket';
import { useCurrentUserQuery } from '@/queries/auth.queries';
import {
  useBattleRoomQuery,
  useCancelBattleRoomMutation,
  useLeaveBattleRoomMutation,
  useSetBattleReadyMutation,
  useStartBattleRoomMutation,
} from '@/queries/battle.queries';
import { buildRoute, ROUTES } from '@/routes/paths';

export default function BattleLobby() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { isConnected } = useBattleRoomSocket(sessionId);
  const { data: currentUser } = useCurrentUserQuery();
  const { data: room, isLoading, isError, refetch, isFetching } = useBattleRoomQuery(sessionId);
  const setReady = useSetBattleReadyMutation(sessionId ?? '');
  const leaveRoom = useLeaveBattleRoomMutation();
  const startRoom = useStartBattleRoomMutation();
  const cancelRoom = useCancelBattleRoomMutation();
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <main className="battle-page battle-page--status">
        <p role="status">Đang tải phòng đấu...</p>
      </main>
    );
  }

  if (isError || !room || !sessionId) {
    return (
      <main className="battle-page battle-page--status">
        <p role="alert">Không thể tải phòng đấu này.</p>
        <Link className="text-action" to={ROUTES.home}>
          Về trang chủ
        </Link>
      </main>
    );
  }

  const currentRoom = room;
  const currentSessionId = sessionId;

  const currentPlayer = currentRoom.players.find((player) => player.userId === currentUser?.id);
  const isHost = currentPlayer?.role === 'HOST';
  const allReady =
    currentRoom.players.length > 0 && currentRoom.players.every((player) => player.ready);
  const canStart = isHost && currentRoom.players.length >= 2 && allReady;
  const isWaiting = currentRoom.status === 'WAITING';

  async function handleCopyCode() {
    await navigator.clipboard.writeText(currentRoom.sessionCode);
    setCopied(true);
    toast.success('Đã sao chép mã phòng.');
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleReady() {
    setReady.mutate(!currentPlayer?.ready, {
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.'),
    });
  }

  function handleStart() {
    startRoom.mutate(currentSessionId, {
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Không thể bắt đầu trận đấu.'),
    });
  }

  function handleLeave() {
    leaveRoom.mutate(currentSessionId, {
      onSuccess: () => navigate(buildRoute.modeSelect(currentRoom.topicId)),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Không thể rời phòng.'),
    });
  }

  function handleCancel() {
    cancelRoom.mutate(currentSessionId, {
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Không thể huỷ phòng.'),
    });
  }

  return (
    <main className="battle-page" aria-labelledby="battle-lobby-title">
      <header className="battle-header">
        <Link className="profile-back-link" to={buildRoute.modeSelect(currentRoom.topicId)}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Rời màn hình</span>
        </Link>
        <div className="page-intro">
          <p className="eyebrow">
            {currentRoom.topicName} · Phòng chờ · {isConnected ? 'Realtime' : 'Đang kết nối'}
          </p>
          <h1 id="battle-lobby-title">Sẵn sàng vào trận?</h1>
          <p>
            {currentRoom.questionCount} câu · {currentRoom.timePerQuestion} giây mỗi câu · tối đa{' '}
            {currentRoom.maxPlayers} người
          </p>
        </div>
      </header>

      <section className="battle-room-banner" aria-label="Mã phòng">
        <div>
          <span className="battle-room-banner__label">Mã phòng</span>
          <strong>{currentRoom.sessionCode}</strong>
        </div>
        <button
          type="button"
          className="icon-action"
          onClick={handleCopyCode}
          title="Sao chép mã phòng"
          aria-label="Sao chép mã phòng"
        >
          {copied ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
        </button>
      </section>

      <div className="battle-lobby-grid">
        <section className="battle-panel" aria-labelledby="players-title">
          <div className="battle-panel__heading">
            <div>
              <p className="eyebrow">
                {currentRoom.players.length}/{currentRoom.maxPlayers} người
              </p>
              <h2 id="players-title">Người chơi</h2>
            </div>
            <button
              type="button"
              className="icon-action"
              onClick={() => refetch()}
              title="Làm mới danh sách"
              aria-label="Làm mới danh sách"
              disabled={isFetching}
            >
              <RefreshCw aria-hidden="true" size={18} className={isFetching ? 'spin' : undefined} />
            </button>
          </div>
          <ul className="battle-player-list">
            {currentRoom.players.map((player) => (
              <li key={player.userId} className="battle-player-row">
                <span className="battle-player-avatar">
                  {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt="" />
                  ) : (
                    <UserRound aria-hidden="true" size={18} />
                  )}
                </span>
                <span className="battle-player-info">
                  <strong>
                    {player.displayName}
                    {player.userId === currentUser?.id ? ' (bạn)' : ''}
                  </strong>
                  <small>{player.role === 'HOST' ? 'Chủ phòng' : 'Người chơi'}</small>
                </span>
                <span
                  className={`battle-ready-state${player.ready ? ' battle-ready-state--ready' : ''}`}
                >
                  {player.ready ? (
                    <Check aria-hidden="true" size={15} />
                  ) : (
                    <span className="battle-ready-state__dot" />
                  )}
                  {player.ready ? 'Sẵn sàng' : 'Đang chờ'}
                </span>
                {player.role === 'HOST' && <Crown aria-label="Chủ phòng" size={16} />}
              </li>
            ))}
          </ul>
        </section>

        <aside className="battle-panel battle-panel--status" aria-labelledby="status-title">
          <Swords aria-hidden="true" size={30} />
          <h2 id="status-title">
            {isWaiting
              ? 'Phòng đang mở'
              : currentRoom.status === 'IN_PROGRESS'
                ? 'Trận đã bắt đầu'
                : 'Phòng đã đóng'}
          </h2>
          <p>
            {isWaiting
              ? 'Chia sẻ mã phòng, chờ mọi người sẵn sàng rồi bắt đầu.'
              : currentRoom.status === 'IN_PROGRESS'
                ? 'Gameplay realtime sẽ được nối ở bước WebSocket tiếp theo.'
                : 'Phòng này không còn nhận thao tác.'}
          </p>

          {isWaiting && (
            <>
              {currentPlayer && (
                <button
                  type="button"
                  className={`primary-action battle-ready-button${currentPlayer?.ready ? ' battle-ready-button--active' : ''}`}
                  onClick={handleReady}
                  disabled={setReady.isPending}
                >
                  {currentPlayer?.ready ? (
                    <X aria-hidden="true" size={18} />
                  ) : (
                    <Check aria-hidden="true" size={18} />
                  )}
                  <span>{currentPlayer?.ready ? 'Huỷ sẵn sàng' : 'Tôi đã sẵn sàng'}</span>
                </button>
              )}
              {isHost && (
                <button
                  type="button"
                  className="primary-action"
                  onClick={handleStart}
                  disabled={!canStart || startRoom.isPending}
                >
                  <Play aria-hidden="true" size={18} />
                  <span>{startRoom.isPending ? 'Đang bắt đầu...' : 'Bắt đầu trận'}</span>
                </button>
              )}
              <p className="battle-requirement">
                {currentRoom.players.length < 2
                  ? 'Cần ít nhất 2 người chơi.'
                  : !allReady
                    ? 'Cần mọi người cùng sẵn sàng.'
                    : 'Mọi người đã sẵn sàng.'}
              </p>
            </>
          )}

          {isWaiting && (
            <button
              type="button"
              className="secondary-action battle-secondary-action"
              onClick={isHost ? handleCancel : handleLeave}
              disabled={leaveRoom.isPending || cancelRoom.isPending}
            >
              <DoorOpen aria-hidden="true" size={18} />
              <span>{isHost ? 'Huỷ phòng' : 'Rời phòng'}</span>
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}
