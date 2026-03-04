import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface QuizCharacter {
  name: string;
  description: string;
  philosophy: string;
  dimensions: string[];
  photo: string;
}

interface QuizData {
  dimensionLabels: Record<string, string>;
  characters: QuizCharacter[];
}

// Raw multilingual shapes (as stored in the DB)
type I18nStr = Record<string, string>;
type I18nDimLabels = Record<string, Record<string, string>>;

interface RawQuestion {
  id: number;
  situation: I18nStr;
  options: { text: I18nStr; dimension: string }[];
}

interface RawCharacter {
  name: I18nStr;
  dimensions: string[];
  photo: string;
  description: I18nStr;
  philosophy: I18nStr;
}

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  /** Extract locale string with 'es' fallback */
  private t(field: unknown, locale: string): string {
    const obj = field as I18nStr;
    return obj[locale] ?? obj['es'] ?? '';
  }

  /** Flatten a multilingual question to the requested locale */
  private resolveQuestion(q: RawQuestion, locale: string) {
    return {
      id: q.id,
      situation: this.t(q.situation, locale),
      options: q.options.map((o) => ({
        text: this.t(o.text, locale),
        dimension: o.dimension,
      })),
    };
  }

  /** Flatten a multilingual character to the requested locale */
  private resolveCharacter(c: RawCharacter, locale: string): QuizCharacter {
    return {
      name: this.t(c.name, locale),
      dimensions: c.dimensions,
      photo: c.photo,
      description: this.t(c.description, locale),
      philosophy: this.t(c.philosophy, locale),
    };
  }

  findAll(locale = 'es') {
    return this.prisma.quiz
      .findMany({
        where: { isActive: true },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          scenarioLabel: true,
          dimensionLabels: true,
          sortOrder: true,
          category: {
            select: { slug: true, label: true, icon: true, sortOrder: true },
          },
        },
        orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      })
      .then((quizzes) =>
        quizzes.map((q) => ({
          ...q,
          title: this.t(q.title, locale),
          description: this.t(q.description, locale),
          scenarioLabel: this.t(q.scenarioLabel, locale),
          dimensionLabels: (q.dimensionLabels as I18nDimLabels)[locale] ??
            (q.dimensionLabels as I18nDimLabels)['es'] ??
            {},
          category: {
            ...q.category,
            label: this.t(q.category.label, locale),
          },
        })),
      );
  }

  findCategories(locale = 'es') {
    return this.prisma.quizCategory
      .findMany({
        include: {
          quizzes: {
            where: { isActive: true },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              scenarioLabel: true,
              dimensionLabels: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      })
      .then((cats) =>
        cats.map((cat) => ({
          ...cat,
          label: this.t(cat.label, locale),
          description: this.t(cat.description, locale),
          quizzes: cat.quizzes.map((q) => ({
            ...q,
            title: this.t(q.title, locale),
            description: this.t(q.description, locale),
            scenarioLabel: this.t(q.scenarioLabel, locale),
            dimensionLabels: (q.dimensionLabels as I18nDimLabels)[locale] ??
              (q.dimensionLabels as I18nDimLabels)['es'] ??
              {},
          })),
        })),
      );
  }

  async findBySlug(slug: string, locale = 'es') {
    const quiz = await this.prisma.quiz.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!quiz) throw new NotFoundException(`Quiz '${slug}' not found`);

    const rawQuestions = quiz.questions as unknown as RawQuestion[];
    const rawCharacters = quiz.characters as unknown as RawCharacter[];
    const rawDimLabels = quiz.dimensionLabels as unknown as I18nDimLabels;

    return {
      ...quiz,
      title: this.t(quiz.title, locale),
      description: this.t(quiz.description, locale),
      scenarioLabel: this.t(quiz.scenarioLabel, locale),
      dimensionLabels: rawDimLabels[locale] ?? rawDimLabels['es'] ?? {},
      questions: rawQuestions.map((q) => this.resolveQuestion(q, locale)),
      characters: rawCharacters.map((c) => this.resolveCharacter(c, locale)),
      category: {
        ...quiz.category,
        label: this.t(quiz.category.label, locale),
        description: this.t(quiz.category.description, locale),
      },
    };
  }

  async findById(id: string, locale = 'es') {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!quiz) throw new NotFoundException(`Quiz '${id}' not found`);
    return this.findBySlug(quiz.slug, locale);
  }

  calculateResult(
    quiz: QuizData,
    answerList: { questionId: number; dimension: string }[],
  ) {
    const dimLabels = quiz.dimensionLabels;
    const characters = quiz.characters;

    const scores: Record<string, number> = {};
    for (const dim of Object.keys(dimLabels)) {
      scores[dim] = 0;
    }
    for (const answer of answerList) {
      if (answer.dimension in scores) {
        scores[answer.dimension]++;
      }
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][0];
    const second = sorted[1]?.[0];
    const gap = sorted[0][1] - (sorted[1]?.[1] ?? 0);

    let character: QuizCharacter | undefined;

    if (gap >= 3) {
      character = characters.find(
        (c) => c.dimensions.length === 1 && c.dimensions[0] === top,
      );
    }

    if (!character && second) {
      character = characters.find(
        (c) =>
          c.dimensions.length === 2 &&
          c.dimensions.includes(top) &&
          c.dimensions.includes(second),
      );
    }

    if (!character) {
      character = characters.find(
        (c) => c.dimensions.length === 1 && c.dimensions[0] === top,
      )!;
    }

    return { character, scores };
  }
}
