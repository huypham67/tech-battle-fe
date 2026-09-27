import { ArrowLeft, ArrowRight, Dumbbell, Swords } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTopicQuery } from '@/queries/topics.queries';
import { buildRoute, ROUTES } from '@/routes/paths';

export default function ModeSelect() {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const { data: topic, isLoading, isError } = useTopicQuery(topicId);

  if (isLoading) {
    return (
      <main className="mode-page mode-page--status">
        <p role="status">Đang tải topic...</p>
      </main>
    );
  }

  if (isError || !topic) {
    return (
      <main className="mode-page mode-page--status">
        <p role="alert">Không tìm thấy topic này.</p>
        <Link className="text-action" to={ROUTES.home}>
          Về trang chủ
        </Link>
      </main>
    );
  }

  return (
    <main className="mode-page" aria-labelledby="mode-title">
      <header className="mode-header">
        <Link className="profile-back-link" to={ROUTES.home}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Về trang chủ</span>
        </Link>

        <div className="page-intro">
          <p className="eyebrow">{topic.name}</p>
          <h1 id="mode-title">Chọn cách chơi</h1>
          <p>Luyện một mình để chắc kiến thức, hoặc mở trận đấu với người khác.</p>
        </div>
      </header>

      <div className="mode-grid">
        <button
          type="button"
          className="mode-card"
          onClick={() => topicId && navigate(buildRoute.practiceSetup(topicId))}
        >
          <span className="mode-card__icon" aria-hidden="true">
            <Dumbbell size={22} strokeWidth={1.8} />
          </span>
          <span className="mode-card__body">
            <span className="mode-card__title">Luyện tập</span>
            <span className="mode-card__desc">
              Trả lời theo nhịp của bạn, có giải thích từng câu.
            </span>
          </span>
          <ArrowRight className="mode-card__arrow" aria-hidden="true" size={18} />
        </button>

        <div className="mode-card mode-card--disabled" aria-disabled="true">
          <span className="mode-card__icon" aria-hidden="true">
            <Swords size={22} strokeWidth={1.8} />
          </span>
          <span className="mode-card__body">
            <span className="mode-card__title">
              Thi đấu
              <span className="mode-card__tag">Sắp có</span>
            </span>
            <span className="mode-card__desc">
              Đấu real-time với người chơi khác theo bảng xếp hạng.
            </span>
          </span>
        </div>
      </div>
    </main>
  );
}
