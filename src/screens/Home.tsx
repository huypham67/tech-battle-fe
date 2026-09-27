import { Box, Boxes, Cloud, Database, Network, Server, Settings2, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildRoute } from '@/routes/paths';
import { useTopicTreeQuery } from '@/queries/topics.queries';

const TOPIC_ICONS: Record<string, LucideIcon> = {
  server: Server,
  database: Database,
  settings: Settings2,
  cloud: Cloud,
  terminal: Terminal,
  network: Network,
  box: Box,
  boxes: Boxes,
};

function HomeStatus({ children }: { children: React.ReactNode }) {
  return <main className="home home--status">{children}</main>;
}

export default function Home() {
  const navigate = useNavigate();
  const { data: topics, isError, isLoading, refetch } = useTopicTreeQuery();

  if (isLoading) {
    return (
      <HomeStatus>
        <p role="status">Đang tải topic...</p>
      </HomeStatus>
    );
  }

  if (isError) {
    return (
      <HomeStatus>
        <p role="alert">Không tải được danh sách topic.</p>
        <button className="text-action" type="button" onClick={() => refetch()}>
          Thử lại
        </button>
      </HomeStatus>
    );
  }

  if (!topics?.length) {
    return (
      <HomeStatus>
        <p>Chưa có topic nào.</p>
      </HomeStatus>
    );
  }

  return (
    <main className="home" aria-labelledby="home-title">
      <header className="page-intro">
        <p className="eyebrow">Topics</p>
        <h1 id="home-title">Chọn topic để bắt đầu</h1>
        <p>Luyện một mình hoặc mở phòng đấu với người khác.</p>
      </header>

      <section className="topic-section" aria-labelledby="topic-section-title">
        <div className="section-heading">
          <h2 id="topic-section-title">Danh sách topic</h2>
          <span className="topic-count">
            <span className="status-dot" aria-hidden="true" />
            {topics.length} topic
          </span>
        </div>

        <div className="topic-grid">
          {topics.map((topic, index) => {
            const visibleChildren = topic.children.slice(0, 3).map((child) => child.name);
            const extraChildren = topic.children.length - visibleChildren.length;
            const TopicIcon = TOPIC_ICONS[topic.iconKey ?? ''] ?? Boxes;

            return (
              <article
                className="topic-card topic-card--interactive"
                key={topic.id}
                style={{ animationDelay: `${index * 45}ms` }}
                role="button"
                tabIndex={0}
                onClick={() => navigate(buildRoute.modeSelect(topic.id))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(buildRoute.modeSelect(topic.id));
                  }
                }}
              >
                <div className="topic-card__topline">
                  <span className="topic-card__icon" aria-hidden="true">
                    <TopicIcon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="topic-card__index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="topic-card__heading">
                  <h3>{topic.name}</h3>
                </div>
                <p className="topic-card__description">{topic.description}</p>
                <div className="topic-card__subtopics" aria-label={`Chủ đề con của ${topic.name}`}>
                  {visibleChildren.map((child) => (
                    <span key={child}>{child}</span>
                  ))}
                  {extraChildren > 0 && <span>+{extraChildren}</span>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
