// Server Components run inside Docker — use internal BACKEND_URL directly.
// Client Components go through Next.js /api rewrite → backend.
const API_BASE =
  typeof window === 'undefined'
    ? (process.env.BACKEND_URL ?? 'http://localhost:3020')
    : '/api';

export interface QuizQuestion {
  id: number;
  situation: string;
  options: { text: string; dimension: string }[];
}

export interface QuizCharacter {
  name: string;
  description: string;
  philosophy: string;
  dimensions: string[];
  photo: string;
}

export interface QuizSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  scenarioLabel: string;
  dimensionLabels: Record<string, string>;
  sortOrder: number;
  category: { slug: string; label: string; icon: string; sortOrder: number };
}

export interface QuizCategory {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  sortOrder: number;
  quizzes: {
    id: string;
    slug: string;
    title: string;
    description: string;
    scenarioLabel: string;
    dimensionLabels: Record<string, string>;
    sortOrder: number;
  }[];
}

export interface QuizFull {
  id: string;
  slug: string;
  title: string;
  description: string;
  scenarioLabel: string;
  dimensionLabels: Record<string, string>;
  questions: QuizQuestion[];
  characters: QuizCharacter[];
  category?: { slug: string; label: string; icon: string; description: string };
}

export function getQuizzes(locale = 'es'): Promise<QuizSummary[]> {
  return fetch(`${API_BASE}/quizzes?locale=${locale}`, {
    cache: 'no-store',
  }).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch quizzes');
    return r.json() as Promise<QuizSummary[]>;
  });
}

export function getQuizCategories(locale = 'es'): Promise<QuizCategory[]> {
  return fetch(`${API_BASE}/quizzes/categories?locale=${locale}`, {
    cache: 'no-store',
  }).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch quiz categories');
    return r.json() as Promise<QuizCategory[]>;
  });
}

export function getQuizBySlug(slug: string, locale = 'es'): Promise<QuizFull> {
  return fetch(`${API_BASE}/quizzes/${slug}?locale=${locale}`, {
    cache: 'no-store',
  }).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch quiz: ${slug}`);
    return r.json() as Promise<QuizFull>;
  });
}

/** Pure-client helper: determine the winning character from scores */
export function calculateResult(
  quiz: QuizFull,
  answers: Record<number, string>,
): { character: QuizCharacter; scores: Record<string, number> } {
  const scores: Record<string, number> = {};
  for (const dim of Object.keys(quiz.dimensionLabels)) {
    scores[dim] = 0;
  }
  for (const dim of Object.values(answers)) {
    if (dim in scores) scores[dim]++;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const second = sorted[1]?.[0];
  const gap = sorted[0][1] - (sorted[1]?.[1] ?? 0);

  let character: QuizCharacter | undefined;

  if (gap >= 3) {
    character = quiz.characters.find(
      (c) => c.dimensions.length === 1 && c.dimensions[0] === top,
    );
  }
  if (!character && second) {
    character = quiz.characters.find(
      (c) =>
        c.dimensions.length === 2 &&
        c.dimensions.includes(top) &&
        c.dimensions.includes(second),
    );
  }
  if (!character) {
    character = quiz.characters.find(
      (c) => c.dimensions.length === 1 && c.dimensions[0] === top,
    )!;
  }

  return { character: character!, scores };
}
