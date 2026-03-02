import {
  questions as ethicsQuestions,
  characters as ethicsCharacters,
  calculateResult as ethicsCalculateResult,
  QUIZ_TITLE as ethicsTitle,
  QUIZ_DESCRIPTION as ethicsDescription,
} from "./ethics";

import {
  questions as virtualQuestions,
  characters as virtualCharacters,
  calculateResult as virtualCalculateResult,
  QUIZ_TITLE as virtualTitle,
  QUIZ_DESCRIPTION as virtualDescription,
} from "./virtual";

export interface QuizMeta {
  slug: string;
  title: string;
  description: string;
  dimensionLabels: Record<string, string>;
  questions: { id: number; situation: string; options: { text: string; dimension: string }[] }[];
  characters: { name: string; description: string; philosophy: string; dimensions: string[]; photo: string }[];
  calculateResult: (answers: Record<number, string>) => {
    character: { name: string; description: string; philosophy: string; dimensions: string[]; photo: string };
    scores: Record<string, number>;
  };
  scenarioLabel: string;
}

export const QUIZ_REGISTRY: Record<string, QuizMeta> = {
  ethics: {
    slug: "ethics",
    title: ethicsTitle,
    description: ethicsDescription,
    dimensionLabels: {
      P: "Pragmatismo",
      I: "Idealismo",
      E: "Empatía",
      R: "Rebeldía",
    },
    questions: ethicsQuestions,
    characters: ethicsCharacters,
    calculateResult: ethicsCalculateResult as QuizMeta["calculateResult"],
    scenarioLabel: "Dilema",
  },
  virtual: {
    slug: "virtual",
    title: virtualTitle,
    description: virtualDescription,
    dimensionLabels: {
      A: "Autenticidad",
      P: "Placer",
      V: "Vínculo",
      S: "Sentido",
    },
    questions: virtualQuestions,
    characters: virtualCharacters,
    calculateResult: virtualCalculateResult as QuizMeta["calculateResult"],
    scenarioLabel: "Escenario",
  },
};

export function getQuizBySlug(slug: string): QuizMeta {
  const quiz = QUIZ_REGISTRY[slug];
  if (!quiz) {
    return QUIZ_REGISTRY.ethics;
  }
  return quiz;
}
