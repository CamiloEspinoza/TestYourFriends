import { apiFetch } from "./api";

export interface SessionInfo {
  id: string;
  code: string;
  quizSlug: string;
  status: "OPEN" | "CLOSED";
  creatorId: string;
  creatorName: string | null;
  participantCount: number;
  createdAt: string;
}

export interface JoinResponse {
  participantId: string;
  sessionId: string;
  quizSlug: string;
  questions: {
    id: number;
    situation: string;
    options: { text: string; dimension: string }[];
  }[];
  alreadyCompleted?: boolean;
  result?: SubmitResponse;
}

export interface SubmitResponse {
  character: {
    name: string;
    description: string;
    philosophy: string;
    dimensions: string[];
    photo: string;
  };
  scores: Record<string, number>;
  dimensionLabels: Record<string, string>;
}

export interface GroupParticipant {
  id: string;
  name: string;
  characterName: string | null;
  scores: Record<string, number> | null;
  completedAt: string | null;
  character: {
    name: string;
    description: string;
    philosophy: string;
    dimensions: string[];
    photo: string;
  } | null;
}

export interface GroupResults {
  code: string;
  quizSlug: string;
  quizTitle: string;
  status: "OPEN" | "CLOSED";
  creatorName: string | null;
  totalParticipants: number;
  completedCount: number;
  participants: GroupParticipant[];
  dimensionLabels: Record<string, string>;
}

export interface SessionParticipant {
  id: string;
  name: string;
  completed: boolean;
  answeredCount: number;
}

export interface MySession {
  id: string;
  code: string;
  quizSlug: string;
  quizTitle: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  totalQuestions: number;
  _count: { participants: number };
  participants: SessionParticipant[];
}

export function createSession(quizSlug: string) {
  return apiFetch<{ id: string; code: string; quizSlug: string }>(
    "/sessions",
    { method: "POST", body: JSON.stringify({ quizSlug }) },
  );
}

export function getMySessions(locale = 'es') {
  return apiFetch<MySession[]>(`/sessions/my?locale=${locale}`);
}

export function getSessionInfo(code: string, locale = 'es') {
  return apiFetch<SessionInfo>(`/sessions/${code}?locale=${locale}`);
}

export function joinSession(code: string, name: string, email?: string, locale = 'es') {
  return apiFetch<JoinResponse>(`/sessions/${code}/join`, {
    method: "POST",
    body: JSON.stringify({ name, email: email || undefined, locale }),
  });
}

export function submitAnswers(
  code: string,
  participantId: string,
  answers: { questionId: number; dimension: string }[],
  locale = 'es',
) {
  return apiFetch<SubmitResponse>(`/sessions/${code}/submit`, {
    method: "POST",
    body: JSON.stringify({ participantId, answers, locale }),
  });
}

export function saveProgress(
  code: string,
  participantId: string,
  questionId: number,
  dimension: string,
) {
  return apiFetch<{ saved: boolean }>(`/sessions/${code}/progress`, {
    method: "POST",
    body: JSON.stringify({ participantId, questionId, dimension }),
  });
}

export function getGroupResults(code: string, locale = 'es') {
  return apiFetch<GroupResults>(`/sessions/${code}/results?locale=${locale}`);
}

export function closeSession(code: string) {
  return apiFetch<{ message: string }>(`/sessions/${code}/close`, {
    method: "PATCH",
  });
}
