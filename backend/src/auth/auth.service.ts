import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RATE_LIMIT_PER_HOUR = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly isDev: boolean;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    this.isDev =
      this.configService.get<string>('NODE_ENV', 'development') !== 'production';
  }

  async sendOtp(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: max OTPs per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await this.prisma.otp.count({
      where: {
        email: normalizedEmail,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentOtps >= OTP_RATE_LIMIT_PER_HOUR) {
      throw new BadRequestException(
        'Demasiados códigos solicitados. Intenta de nuevo en una hora.',
      );
    }

    // Invalidate any existing unused OTPs for this email
    await this.prisma.otp.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Generate 6-digit code
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.otp.create({
      data: { email: normalizedEmail, code, expiresAt },
    });

    // Send email
    await this.mailService.sendOtpEmail(normalizedEmail, code);

    this.logger.log(`OTP sent to ${normalizedEmail}`);

    // In development, include the code in the response for easier testing
    if (this.isDev) {
      return { message: 'Código enviado a tu email', devCode: code };
    }
    return { message: 'Código enviado a tu email' };
  }

  async verifyOtp(email: string, code: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const otp = await this.prisma.otp.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('Código expirado o inválido');
    }

    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { used: true },
      });
      throw new UnauthorizedException(
        'Demasiados intentos. Solicita un nuevo código.',
      );
    }

    if (otp.code !== code) {
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Código incorrecto');
    }

    // Mark OTP as used
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email: normalizedEmail },
      });
    }

    const accessToken = this.issueToken(user.id, user.email);
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private issueToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
