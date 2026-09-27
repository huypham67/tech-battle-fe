import { ArrowLeft, Play } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreatePracticeSessionMutation } from '@/queries/practice.queries';
import { useTopicQuery } from '@/queries/topics.queries';
import { buildRoute, ROUTES } from '@/routes/paths';
import type { Difficulty } from '@/types/practice';

const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'BEGINNER', label: 'Cơ bản', hint: 'Nền tảng, khởi động' },
  { value: 'INTERMEDIATE', label: 'Trung cấp', hint: 'Vận dụng thực tế' },
  { value: 'ADVANCED', label: 'Nâng cao', hint: 'Tình huống khó' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function PracticeSetup() {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const { data: topic, isLoading, isError } = useTopicQuery(topicId);
  const createSession = useCreatePracticeSessionMutation();

  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');
  const [questionCount, setQuestionCount] = useState(10);

  if (isLoading) {
    return (
      <main className="setup-page setup-page--status">
        <p role="status">Đang tải topic...</p>
      </main>
    );
  }

  if (isError || !topic || !topicId) {
    return (
      <main className="setup-page setup-page--status">
        <p role="alert">Không tìm thấy topic này.</p>
        <Link className="text-action" to={ROUTES.home}>
          Về trang chủ
        </Link>
      </main>
    );
  }

  function handleStart() {
    if (!topicId) {
      return;
    }

    createSession.mutate(
      { topicId, difficulty, questionCount },
      {
        onSuccess: (session) => {
          navigate(buildRoute.practiceSession(session.id));
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể bắt đầu phiên luyện tập.',
          );
        },
      },
    );
  }

  return (
    <main className="setup-page" aria-labelledby="setup-title">
      <header className="setup-header">
        <Link className="profile-back-link" to={buildRoute.modeSelect(topicId)}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Chọn lại cách chơi</span>
        </Link>

        <div className="page-intro">
          <p className="eyebrow">{topic.name} · Luyện tập</p>
          <h1 id="setup-title">Thiết lập phiên luyện</h1>
          <p>Chọn độ khó và số câu hỏi, rồi bắt đầu ngay.</p>
        </div>
      </header>

      <section className="setup-block" aria-labelledby="setup-difficulty">
        <h2 id="setup-difficulty">Độ khó</h2>
        <div className="setup-options">
          {DIFFICULTIES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`setup-option${difficulty === item.value ? ' setup-option--active' : ''}`}
              onClick={() => setDifficulty(item.value)}
              aria-pressed={difficulty === item.value}
            >
              <span className="setup-option__label">{item.label}</span>
              <span className="setup-option__hint">{item.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="setup-block" aria-labelledby="setup-count">
        <h2 id="setup-count">Số câu hỏi</h2>
        <div className="setup-options setup-options--count">
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              className={`setup-chip${questionCount === count ? ' setup-chip--active' : ''}`}
              onClick={() => setQuestionCount(count)}
              aria-pressed={questionCount === count}
            >
              {count} câu
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="primary-action setup-start"
        onClick={handleStart}
        disabled={createSession.isPending}
      >
        <Play aria-hidden="true" size={18} />
        <span>{createSession.isPending ? 'Đang tạo phiên...' : 'Bắt đầu luyện'}</span>
      </button>
    </main>
  );
}
