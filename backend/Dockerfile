# ── Stage 1: Install dependencies ──
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .pnpm-approve-builds.json ./
COPY backend/package.json backend/

RUN pnpm install --filter backend... --frozen-lockfile

# ── Stage 2: Build ──
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/ backend/

# Generate Prisma client
RUN cd backend && pnpm prisma generate

# Build NestJS
RUN pnpm --filter backend build

# ── Stage 3: Production image ──
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

# Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

WORKDIR /app

# Copy only what's needed at runtime
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nestjs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=nestjs:nodejs /app/backend/generated ./backend/generated
COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma ./backend/prisma
COPY --chown=nestjs:nodejs backend/prisma.config.ts backend/
COPY --chown=nestjs:nodejs backend/package.json backend/
COPY --chown=nestjs:nodejs package.json pnpm-workspace.yaml pnpm-lock.yaml ./

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Run migrations then start production server
CMD ["sh", "-c", "cd backend && pnpm prisma migrate deploy && node dist/src/main.js"]
