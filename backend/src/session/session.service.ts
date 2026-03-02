import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { QuizService } from '../quiz/quiz.service';
import { MailService } from '../mail/mail.service';

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
    let code: string;
    let attempts = 0;
    // Retry on code collision
    while (true) {
      code = this.generateCode();
      const existing = await this.prisma.session.findUnique({
        where: { code },
      });
      if (!existing) break;
      attempts++;
      if (attempts > 10) throw new BadRequestException('Failed to generate unique code');
    }

    const session = await this.prisma.session.create({
      data: { code, quizSlug, creatorId },
    });

    return { id: session.id, code: session.code, quizSlug: session.quizSlug };
  }

  async findMySessions(userId: string) {
    return this.prisma.session.findMany({
      where: { creatorId: userId },
      include: {
        _count: { select: { participants: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCode(code: string) {
    const session = await this.prisma.session.findUnique({
      where: { code },
      include: {
        _count: { select: { participants: true } },
        creator: { select: { name: true } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    return {
      id: session.id,
      code: session.code,
      quizSlug: session.quizSlug,
      status: session.status,
      creatorName: session.creator.name,
      participantCount: session._count.participants,
      createdAt: session.createdAt,
    };
  }

  async join(code: string, name: string, email?: string) {
    const session = await this.prisma.session.findUnique({
      where: { code },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.status === 'CLOSED') {
      throw new BadRequestException('Session is closed');
    }

    const participant = await this.prisma.participant.create({
      data: { sessionId: session.id, name, email },
    });

    const questions = this.quizService.getQuestions(session.quizSlug);

    return {
      participantId: participant.id,
      sessionId: session.id,
      quizSlug: session.quizSlug,
      questions,
    };
  }

  async submit(code: string, participantId: string, answers: { questionId: number; dimension: string }[]) {
    const session = await this.prisma.session.findUnique({
      where: { code },
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

    const result = this.quizService.calculateFromAnswerList(session.quizSlug, answers);

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
          ...(() => {
            const scoreValues = Object.values(result.scores);
            return {
              scoreP: scoreValues[0],
              scoreI: scoreValues[1],
              scoreE: scoreValues[2],
              scoreR: scoreValues[3],
            };
          })(),
        },
      }),
    ]);

    // Send email if participant provided email (fire-and-forget)
    if (participant.email) {
      const scoreValues = Object.values(result.scores);
      this.mailService.sendGroupResultsEmail({
        to: participant.email,
        participantName: participant.name,
        sessionCode: code,
        characterName: result.character.name,
        characterDescription: result.character.description,
        scoreP: scoreValues[0],
        scoreI: scoreValues[1],
        scoreE: scoreValues[2],
        scoreR: scoreValues[3],
      });
    }

    return {
      character: result.character,
      scores: result.scores,
    };
  }

  async getResults(code: string) {
    const session = await this.prisma.session.findUnique({
      where: { code },
      include: {
        participants: {
          where: { completed: true },
          select: {
            id: true,
            name: true,
            characterName: true,
            scoreP: true,
            scoreI: true,
            scoreE: true,
            scoreR: true,
            completedAt: true,
          },
          orderBy: { completedAt: 'asc' },
        },
        _count: { select: { participants: true } },
        creator: { select: { name: true } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');

    const characters = this.quizService.getCharacters(session.quizSlug);

    const participantsWithDetails = session.participants.map((p) => {
      const character = characters.find((c) => c.name === p.characterName);
      return {
        ...p,
        character: character || null,
      };
    });

    return {
      code: session.code,
      quizSlug: session.quizSlug,
      status: session.status,
      creatorName: session.creator.name,
      totalParticipants: session._count.participants,
      completedCount: session.participants.length,
      participants: participantsWithDetails,
    };
  }

  async close(code: string, userId: string) {
    const session = await this.prisma.session.findUnique({
      where: { code },
    });
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
