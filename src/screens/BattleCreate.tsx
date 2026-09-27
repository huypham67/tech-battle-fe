import { ArrowLeft, DoorOpen, Flag, Play, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateBattleRoomMutation, useJoinBattleRoomMutation } from '@/queries/battle.queries';
import { useTopicQuery } from '@/queries/topics.queries';
import { buildRoute, ROUTES } from '@/routes/paths';
import type { Difficulty } from '@/types/practice';
import type { SessionVisibility } from '@/types/battle';

const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'BEGINNER', label: 'Cơ bản', hint: 'Nền tảng, khởi động' },
  { value: 'INTERMEDIATE', label: 'Trung cấp', hint: 'Vận dụng thực tế' },
  { value: 'ADVANCED', label: 'Nâng cao', hint: 'Tình huống khó' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];
const PLAYER_COUNTS = [2, 4, 8, 16];
const TIME_OPTIONS = [15, 20, 30, 45];

export default function BattleCreate() {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const { data: topic, isLoading, isError } = useTopicQuery(topicId);
  const createRoom = useCreateBattleRoomMutation();
  const joinRoom = useJoinBattleRoomMutation();
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');
  const [questionCount, setQuestionCount] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [visibility, setVisibility] = useState<SessionVisibility>('PUBLIC');
  const [sessionCode, setSessionCode] = useState('');

  if (isLoading) {
    return (
      <main className="battle-page battle-page--status">
        <p role="status">Đang tải topic...</p>
      </main>
    );
  }

  if (isError || !topic || !topicId) {
    return (
      <main className="battle-page battle-page--status">
        <p role="alert">Không tìm thấy topic này.</p>
        <Link className="text-action" to={ROUTES.home}>
          Về trang chủ
        </Link>
      </main>
    );
  }

  const selectedTopicId = topicId;

  function handleCreate() {
    createRoom.mutate(
      {
        topicId: selectedTopicId,
        difficulty,
        questionCount,
        timePerQuestion,
        maxPlayers,
        visibility,
      },
      {
        onSuccess: (room) => navigate(buildRoute.battleRoom(room.id)),
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Không thể tạo phòng đấu.');
        },
      },
    );
  }

  function handleJoin() {
    const code = sessionCode.trim();
    if (!code) {
      toast.error('Nhập mã phòng để tham gia.');
      return;
    }

    joinRoom.mutate(
      { sessionCode: code },
      {
        onSuccess: (room) => navigate(buildRoute.battleRoom(room.id)),
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Không thể tham gia phòng đấu.');
        },
      },
    );
  }

  return (
    <main className="battle-page" aria-labelledby="battle-create-title">
      <header className="battle-header">
        <Link className="profile-back-link" to={buildRoute.modeSelect(selectedTopicId)}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Chọn lại cách chơi</span>
        </Link>
        <div className="page-intro">
          <p className="eyebrow">{topic.name} · Thi đấu</p>
          <h1 id="battle-create-title">Mở một trận đấu</h1>
          <p>Tạo phòng cho nhóm của bạn, hoặc nhập mã để vào phòng đang chờ.</p>
        </div>
      </header>

      <div className="battle-create-grid">
        <section className="battle-panel" aria-labelledby="battle-settings-title">
          <div className="battle-panel__heading">
            <div>
              <p className="eyebrow">Phòng mới</p>
              <h2 id="battle-settings-title">Thiết lập trận</h2>
            </div>
            <Flag aria-hidden="true" size={20} />
          </div>

          <div className="battle-field-group">
            <span className="battle-field-label">Độ khó</span>
            <div className="battle-choice-grid battle-choice-grid--three">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`battle-choice${difficulty === item.value ? ' battle-choice--active' : ''}`}
                  onClick={() => setDifficulty(item.value)}
                  aria-pressed={difficulty === item.value}
                >
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="battle-field-row">
            <div className="battle-field-group">
              <span className="battle-field-label">Số câu</span>
              <div className="battle-choice-grid battle-choice-grid--four">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`battle-chip${questionCount === count ? ' battle-chip--active' : ''}`}
                    onClick={() => setQuestionCount(count)}
                    aria-pressed={questionCount === count}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <div className="battle-field-group">
              <span className="battle-field-label">Thời gian / câu</span>
              <div className="battle-choice-grid battle-choice-grid--four">
                {TIME_OPTIONS.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    className={`battle-chip${timePerQuestion === seconds ? ' battle-chip--active' : ''}`}
                    onClick={() => setTimePerQuestion(seconds)}
                    aria-pressed={timePerQuestion === seconds}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="battle-field-row">
            <div className="battle-field-group">
              <span className="battle-field-label">Số người tối đa</span>
              <div className="battle-choice-grid battle-choice-grid--four">
                {PLAYER_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`battle-chip${maxPlayers === count ? ' battle-chip--active' : ''}`}
                    onClick={() => setMaxPlayers(count)}
                    aria-pressed={maxPlayers === count}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <div className="battle-field-group">
              <span className="battle-field-label">Quyền truy cập</span>
              <div className="battle-choice-grid battle-choice-grid--two">
                <button
                  type="button"
                  className={`battle-choice battle-choice--compact${visibility === 'PUBLIC' ? ' battle-choice--active' : ''}`}
                  onClick={() => setVisibility('PUBLIC')}
                  aria-pressed={visibility === 'PUBLIC'}
                >
                  Công khai
                </button>
                <button
                  type="button"
                  className={`battle-choice battle-choice--compact${visibility === 'PRIVATE' ? ' battle-choice--active' : ''}`}
                  onClick={() => setVisibility('PRIVATE')}
                  aria-pressed={visibility === 'PRIVATE'}
                >
                  Riêng tư
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="primary-action"
            onClick={handleCreate}
            disabled={createRoom.isPending}
          >
            <Play aria-hidden="true" size={18} />
            <span>{createRoom.isPending ? 'Đang tạo phòng...' : 'Tạo phòng đấu'}</span>
          </button>
        </section>

        <section className="battle-panel battle-panel--join" aria-labelledby="join-room-title">
          <div className="battle-panel__heading">
            <div>
              <p className="eyebrow">Có mã phòng?</p>
              <h2 id="join-room-title">Tham gia ngay</h2>
            </div>
            <Users aria-hidden="true" size={20} />
          </div>
          <p>Nhập mã hiển thị trên màn hình của người tạo phòng.</p>
          <label className="battle-code-field">
            <span>Mã phòng</span>
            <input
              value={sessionCode}
              onChange={(event) => setSessionCode(event.target.value.toUpperCase())}
              placeholder="BTL-ABC123"
              maxLength={10}
              autoComplete="off"
            />
          </label>
          <button
            type="button"
            className="secondary-action"
            onClick={handleJoin}
            disabled={joinRoom.isPending}
          >
            <DoorOpen aria-hidden="true" size={18} />
            <span>{joinRoom.isPending ? 'Đang vào phòng...' : 'Tham gia phòng'}</span>
          </button>
        </section>
      </div>
    </main>
  );
}
