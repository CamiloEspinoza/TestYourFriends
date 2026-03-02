import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Validate required env vars in production
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  if (nodeEnv === 'production') {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret || jwtSecret === 'dev-secret-change-me-in-production') {
      logger.error('JWT_SECRET must be set to a secure value in production');
      process.exit(1);
    }
  }

  // CORS: configurable via CORS_ORIGINS env var (comma-separated)
  const corsOrigins = configService.get<string>(
    'CORS_ORIGINS',
    'http://localhost:3001,http://localhost',
  );
  app.enableCors({
    origin: corsOrigins.split(',').map((o) => o.trim()),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Application running on port ${port} (${nodeEnv})`);
}
void bootstrap();
