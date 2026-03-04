import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { QuizService, type QuizCharacter } from '../quiz/quiz.service.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private quizService: QuizService,
    private mailService: MailService,
  ) {}

  private generateCode(): string {
    return randomBytes(4).toString('hex').toUpperCase().slice(0, 8);
  }

  async create(creatorId: string, quizSlug: string) {
    // Validate quiz exists
    const quiz = await this.quizService.findBySlug(quizSlug);

    let code: string;
    let attempts = 0;
    // Retry on code collision
    while (true) {
      code = this.generateCode();
      const existing = await this.prisma.session.findUnique({ where: { code } });
      if (!existing) break;
      attempts++;
      if (attempts > 10) throw new BadRequestException('Failed to generate unique code');
    }

    const session = await this.prisma.session.create({
      data: { code, quizId: quiz.id, creatorId },
    });

    return { id: session.id, code: session.code, quizSlug: quiz.slug };
  }

  private t(field: unknown, locale: string): string {
    const obj = field as Record<string, string>;
    return obj[locale] ?? obj['es'] ?? '';
  }

  async findMySessions(userId: string, locale = 'es') {
    const sessions = await this.prisma.session.findMany({
      where: { creatorId: userId },
      include: {
        _count: { select: { participants: true } },
        quiz: { select: { slug: true, title: true, questions: true } },
        participants: {
          include: {
            _count: { select: { answers: true } },
          },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => {
      const totalQuestions = (s.quiz.questions as unknown[]).length;
      return {
        id: s.id,
        code: s.code,
        quizSlug: s.quiz.slug,
        quizTitle: this.t(s.quiz.title, locale),
        status: s.status,
        createdAt: s.createdAt,
        _count: s._count,
        totalQuestions,
        participants: s.participants.map((p) => ({
          id: p.id,
          name: p.name,
          completed: p.completed,
          answeredCount: p._count.answers,
        })),
      };
    });
  }

  async findByCode(code: string, locale = 'es') {
    const session = await this.prisma.session.findUnique({
      where: { code },
      include: {
        _count: { select: { participants: true } },
        creator: { select: { name: true } },
        quiz: { select: { slug: true, title: true } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    return {
      id: session.id,
      code: session.code,
      quizSlug: session.quiz.slug,
      quizTitle: this.t(session.quiz.title, locale),
      status: session.status,
      creatorId: session.creatorId,
      creatorName: session.creator.name,
      participantCount: session._count.participants,
      createdAt: session.createdAt,
    };
  }

  async join(code: string, name: string, email?: string, locale = 'es') {
    const session = await this.prisma.session.findUnique({
      where: { code },
      include: { quiz: { select: { id: true, slug: true } } },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.status === 'CLOSED') {
      throw new BadRequestException('Session is closed');
    }

    const participant = await this.prisma.participant.create({
      data: { sessionId: session.id, name, email },
    });

    // Fetch quiz with locale-resolved questions
    const quiz = await this.quizService.findBySlug(session.quiz.slug, locale);

    return {
      participantId: participant.id,
      sessionId: session.id,
      quizSlug: quiz.slug,
      questions: quiz.questions,
    };
  }

  async submit(
    code: string,
    participantId: string,
    answers: { questionId: number; dimension: string }[],
    locale = 'es',
  ) {
    const session = await this.prisma.session.findUnique({
      where: { code },
      include: { quiz: { select: { id: true, slug: true } } },
    });
    if (!session) throw new NotFoundException('Session not found');

    const participant = await this.prisma.participant.findUnique({
      where: { id: participantId },
    });
    if (!participant || participant.sessionId !== session.id) {
      throw new NotFoundException('Participant not found in this session');
    }
    if (participant.completed) {
      throw new BadRequestException('Already submitted');
    }

    // Get locale-resolved quiz data for character matching and result
    const resolvedQuiz = await this.quizService.findBySlug(session.quiz.slug, locale);
    const quiz = {
      dimensionLabels: resolvedQuiz.dimensionLabels as Record<string, string>,
      characters: resolvedQuiz.characters as QuizCharacter[],
    };

    const result = this.quizService.calculateResult(quiz, answers);

    await this.prisma.$transaction([
      ...answers.map((a) =>
        this.prisma.answer.create({
          data: {
            participantId,
            questionId: a.questionId,
            dimension: a.dimension,
          },
        }),
      ),
      this.prisma.participant.update({
        where: { id: participantId },
        data: {
          completed: true,
          completedAt: new Date(),
          characterName: result.character.name,
          scores: result.scores,
        },
      }),
    ]);

    // Fire-and-forget email
    if (participant.email) {
      this.mailService.sendGroupResultsEmail({
        to: participant.email,
        participantName: participant.name,
        sessionCode: code,
        characterName: result.character.name,
        characterDescription: result.character.description,
        scores: result.scores,
        dimensionLabels: resolvedQuiz.dimensionLabels as Record<string, string>,
      }).catch(() => {});
    }

    return {
      character: result.character,
      scores: result.scores,
      dimensionLabels: resolvedQuiz.dimensionLabels as Record<string, string>,
    };
  }

  async getResults(code: string, locale = 'es') {
    const session = await this.prisma.session.findUnique({
      where: { code },
      include: {
        quiz: { select: { slug: true } },
        participants: {
          where: { completed: true },
          select: {
            id: true,
            name: true,
            characterName: true,
            scores: true,
            completedAt: true,
          },
          orderBy: { completedAt: 'asc' },
        },
        _count: { select: { participants: true } },
        creator: { select: { name: true } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');

    const resolvedQuiz = await this.quizService.findBySlug(session.quiz.slug, locale);
    const dimLabels = resolvedQuiz.dimensionLabels as Record<string, string>;
    const characters = resolvedQuiz.characters as QuizCharacter[];

    const participantsWithDetails = session.participants.map((p) => {
      const character = characters.find((c) => c.name === p.characterName);
      return {
        ...p,
        scores: p.scores as Record<string, number> | null,
        character: character || null,
      };
    });

    return {
      code: session.code,
      quizSlug: session.quiz.slug,
      quizTitle: resolvedQuiz.title,
      status: session.status,
      creatorName: session.creator.name,
      totalParticipants: session._count.participants,
      completedCount: session.participants.length,
      participants: participantsWithDetails,
      dimensionLabels: dimLabels,
    };
  }

  async saveProgress(
    code: string,
    participantId: string,
    questionId: number,
    dimension: string,
  ) {
    const session = await this.prisma.session.findUnique({ where: { code } });
    if (!session) throw new NotFoundException('Session not found');

    const participant = await this.prisma.participant.findUnique({
      where: { id: participantId },
    });
    if (!participant || participant.sessionId !== session.id) {
      throw new NotFoundException('Participant not found');
    }
    if (participant.completed) return { saved: true }; // already done, ignore

    await this.prisma.answer.upsert({
      where: { participantId_questionId: { participantId, questionId } },
      update: { dimension },
      create: { participantId, questionId, dimension },
    });

    return { saved: true };
  }

  async close(code: string, userId: string) {
    const session = await this.prisma.session.findUnique({ where: { code } });
    if (!session) throw new NotFoundException('Session not found');
    if (session.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can close this session');
    }

    await this.prisma.session.update({
      where: { code },
      data: { status: 'CLOSED', closedAt: new Date() },
    });

    return { message: 'Session closed' };
  }
}
