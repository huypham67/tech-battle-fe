import { ArrowRight, Check, Trophy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  usePracticeSessionQuery,
  useSubmitPracticeAnswerMutation,
} from '@/queries/practice.queries';
import { buildRoute } from '@/routes/paths';
import type { PracticeAnswerResponse, PracticeQuestionResponse } from '@/types/practice';

export default function PracticeQuestion() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const sessionQuery = usePracticeSessionQuery(sessionId);
  const submitAnswer = useSubmitPracticeAnswerMutation(sessionId ?? '');

  const [activeQuestion, setActiveQuestion] = useState<PracticeQuestionResponse | null>(null);
  const [feedback, setFeedback] = useState<PracticeAnswerResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const startAtRef = useRef<number>(0);

  const session = sessionQuery.data;

  useEffect(() => {
    if (!session || activeQuestion || feedback) {
      return;
    }

    if (session.status === 'FINISHED' || !session.currentQuestion) {
      if (sessionId) {
        navigate(buildRoute.practiceResult(sessionId), { replace: true });
      }
      return;
    }

    setActiveQuestion(session.currentQuestion);
    startAtRef.current = Date.now();
  }, [session, activeQuestion, feedback, navigate, sessionId]);

  if (sessionQuery.isLoading) {
    return (
      <main className="quiz-page quiz-page--status">
        <p role="status">Đang tải câu hỏi...</p>
      </main>
    );
  }

  if (sessionQuery.isError || !session || !sessionId) {
    return (
      <main className="quiz-page quiz-page--status">
        <p role="alert">Không tải được phiên luyện tập.</p>
      </main>
    );
  }

  if (!activeQuestion) {
    return (
      <main className="quiz-page quiz-page--status">
        <p role="status">Đang chuẩn bị...</p>
      </main>
    );
  }

  function handleSelect(optionId: string) {
    if (feedback || submitAnswer.isPending || !activeQuestion) {
      return;
    }

    setSelectedOptionId(optionId);

    submitAnswer.mutate(
      {
        questionId: activeQuestion.id,
        optionId,
        answerTimeMs: Date.now() - startAtRef.current,
      },
      {
        onSuccess: (result) => setFeedback(result),
        onError: (error) => {
          setSelectedOptionId(null);
          toast.error(
            error instanceof Error ? error.message : 'Không gửi được câu trả lời. Thử lại nhé.',
          );
        },
      },
    );
  }

  function handleNext() {
    if (!feedback || !sessionId) {
      return;
    }

    if (feedback.nextQuestion && feedback.status !== 'FINISHED') {
      setActiveQuestion(feedback.nextQuestion);
      setFeedback(null);
      setSelectedOptionId(null);
      startAtRef.current = Date.now();
      return;
    }

    navigate(buildRoute.practiceResult(sessionId));
  }

  const isFinished =
    feedback?.status === 'FINISHED' || (feedback != null && !feedback.nextQuestion);

  return (
    <main className="quiz-page" aria-labelledby="quiz-title">
      <header className="quiz-header">
        <p className="eyebrow">{session.topicName}</p>
        <div className="quiz-progress" aria-label="Tiến độ">
          <span>
            Câu {activeQuestion.questionNumber} / {session.questionCount}
          </span>
          <span className="quiz-progress__bar" aria-hidden="true">
            <span
              className="quiz-progress__fill"
              style={{
                width: `${(activeQuestion.questionNumber / session.questionCount) * 100}%`,
              }}
            />
          </span>
        </div>
      </header>

      <h1 id="quiz-title" className="quiz-question">
        {activeQuestion.content}
      </h1>

      <ul className="quiz-options" aria-label="Đáp án">
        {activeQuestion.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let stateClass = '';

          if (feedback && isSelected) {
            stateClass = feedback.correct ? ' quiz-option--correct' : ' quiz-option--wrong';
          } else if (isSelected) {
            stateClass = ' quiz-option--selected';
          }

          return (
            <li key={option.id}>
              <button
                type="button"
                className={`quiz-option${stateClass}`}
                onClick={() => handleSelect(option.id)}
                disabled={Boolean(feedback) || submitAnswer.isPending}
              >
                <span>{option.content}</span>
                {feedback && isSelected && (
                  <span className="quiz-option__mark" aria-hidden="true">
                    {feedback.correct ? <Check size={18} /> : <X size={18} />}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {feedback && (
        <section
          className={`quiz-feedback${feedback.correct ? ' quiz-feedback--correct' : ' quiz-feedback--wrong'}`}
          aria-live="polite"
        >
          <div className="quiz-feedback__head">
            <span className="quiz-feedback__title">
              {feedback.correct ? 'Chính xác!' : 'Chưa đúng'}
            </span>
            <span className="quiz-feedback__score">+{feedback.scoreEarned} điểm</span>
          </div>
          {feedback.explanation && <p className="quiz-feedback__text">{feedback.explanation}</p>}
          <button type="button" className="primary-action" onClick={handleNext}>
            {isFinished ? (
              <>
                <Trophy aria-hidden="true" size={18} />
                <span>Xem kết quả</span>
              </>
            ) : (
              <>
                <span>Câu tiếp theo</span>
                <ArrowRight aria-hidden="true" size={18} />
              </>
            )}
          </button>
        </section>
      )}
    </main>
  );
}
