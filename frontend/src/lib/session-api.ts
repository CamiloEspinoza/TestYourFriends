import { apiFetch } from "./api";

export interface SessionInfo {
  id: string;
  code: string;
  quizSlug: string;
  status: "OPEN" | "CLOSED";
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
}

export interface GroupParticipant {
  id: string;
  name: string;
  characterName: string | null;
  scoreP: number | null;
  scoreI: number | null;
  scoreE: number | null;
  scoreR: number | null;
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
  status: "OPEN" | "CLOSED";
  creatorName: string | null;
  totalParticipants: number;
  completedCount: number;
  participants: GroupParticipant[];
}

export interface MySession {
  id: string;
  code: string;
  quizSlug: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  _count: { participants: number };
}

export function createSession(quizSlug: string) {
  return apiFetch<{ id: string; code: string; quizSlug: string }>(
    "/sessions",
    { method: "POST", body: JSON.stringify({ quizSlug }) },
  );
}

export function getMySessions() {
  return apiFetch<MySession[]>("/sessions/my");
}

export function getSessionInfo(code: string) {
  return apiFetch<SessionInfo>(`/sessions/${code}`);
}

export function joinSession(code: string, name: string, email?: string) {
  return apiFetch<JoinResponse>(`/sessions/${code}/join`, {
    method: "POST",
    body: JSON.stringify({ name, email: email || undefined }),
  });
}

export function submitAnswers(
  code: string,
  participantId: string,
  answers: { questionId: number; dimension: string }[],
) {
  return apiFetch<SubmitResponse>(`/sessions/${code}/submit`, {
    method: "POST",
    body: JSON.stringify({ participantId, answers }),
  });
}

export function getGroupResults(code: string) {
  return apiFetch<GroupResults>(`/sessions/${code}/results`);
}

export function closeSession(code: string) {
  return apiFetch<{ message: string }>(`/sessions/${code}/close`, {
    method: "PATCH",
  });
}
