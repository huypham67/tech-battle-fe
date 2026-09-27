import { Home, RotateCcw, Target, Trophy } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePracticeResultQuery } from '@/queries/practice.queries';
import { buildRoute, ROUTES } from '@/routes/paths';

export default function PracticeResult() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: result, isLoading, isError } = usePracticeResultQuery(sessionId);

  if (isLoading) {
    return (
      <main className="result-page result-page--status">
        <p role="status">Đang tổng kết...</p>
      </main>
    );
  }

  if (isError || !result) {
    return (
      <main className="result-page result-page--status">
        <p role="alert">Không tải được kết quả.</p>
        <Link className="text-action" to={ROUTES.home}>
          Về trang chủ
        </Link>
      </main>
    );
  }

  const accuracyPercent = Math.round(result.accuracy * 100);

  return (
    <main className="result-page" aria-labelledby="result-title">
      <header className="result-hero">
        <span className="result-hero__icon" aria-hidden="true">
          <Trophy size={26} />
        </span>
        <p className="eyebrow">{result.topicName} · Luyện tập</p>
        <h1 id="result-title">Hoàn thành!</h1>
        <p className="result-hero__score">{result.totalScore} điểm</p>
      </header>

      <section className="result-stats" aria-label="Thống kê">
        <div className="result-stat">
          <span className="result-stat__value">
            {result.correctAnswers}/{result.totalQuestions}
          </span>
          <span className="result-stat__label">Câu đúng</span>
        </div>
        <div className="result-stat">
          <span className="result-stat__value">
            <Target aria-hidden="true" size={16} />
            {accuracyPercent}%
          </span>
          <span className="result-stat__label">Độ chính xác</span>
        </div>
        <div className="result-stat">
          <span className="result-stat__value">{result.wrongAnswers}</span>
          <span className="result-stat__label">Câu sai</span>
        </div>
        <div className="result-stat">
          <span className="result-stat__value">{result.unansweredQuestions}</span>
          <span className="result-stat__label">Chưa trả lời</span>
        </div>
      </section>

      <div className="result-actions">
        <button
          type="button"
          className="primary-action"
          onClick={() => navigate(buildRoute.practiceSetup(result.topicId))}
        >
          <RotateCcw aria-hidden="true" size={18} />
          <span>Luyện lại</span>
        </button>
        <Link className="secondary-action" to={ROUTES.home}>
          <Home aria-hidden="true" size={18} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </main>
  );
}
