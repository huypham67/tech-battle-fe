export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export type SessionStatus = 'CREATED' | 'WAITING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';

export interface PracticeQuestionOptionResponse {
  id: string;
  content: string;
  displayOrder: number;
}

export interface PracticeQuestionResponse {
  id: string;
  questionNumber: number;
  content: string;
  questionType: QuestionType;
  options: PracticeQuestionOptionResponse[];
}

export interface PracticeSessionResponse {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  questionCount: number;
  currentQuestionIndex: number;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string | null;
  currentQuestion: PracticeQuestionResponse | null;
}

export interface PracticeAnswerResponse {
  sessionId: string;
  questionId: string;
  correct: boolean;
  scoreEarned: number;
  explanation: string | null;
  currentQuestionIndex: number;
  status: SessionStatus;
  nextQuestion: PracticeQuestionResponse | null;
}

export interface PracticeResultResponse {
  sessionId: string;
  topicId: string;
  topicName: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  totalScore: number;
  accuracy: number;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string | null;
}

export interface CreatePracticeSessionRequest {
  topicId: string;
  difficulty: Difficulty;
  questionCount: number;
}

export interface SubmitPracticeAnswerRequest {
  questionId: string;
  optionId: string;
  answerTimeMs: number;
}
