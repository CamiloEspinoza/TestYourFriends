# TestYourFriends

## Project Structure

Monorepo with two main packages:

- **frontend/**: Next.js 16 app with TypeScript, Tailwind CSS v4, and shadcn/ui
- **backend/**: NestJS app with TypeScript and Prisma ORM (SQLite)

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: NestJS, TypeScript, Prisma 7 (SQLite)
- **UI Components**: shadcn/ui (New York style, CSS variables, Lucide icons)

## Commands

### Frontend
- `npm run dev:frontend` — Start Next.js dev server
- `npm run build:frontend` — Build frontend for production
- `npm run lint:frontend` — Lint frontend code

### Backend
- `npm run dev:backend` — Start NestJS dev server
- `npm run build:backend` — Build backend for production
- `npm run lint:backend` — Lint backend code
- `npm run test:backend` — Run backend tests

### Database
- `npm run db:migrate` — Run Prisma migrations
- `npm run db:generate` — Generate Prisma client
- `npm run db:studio` — Open Prisma Studio

## Key Conventions

- Frontend uses `@/*` path alias mapping to `./src/*`
- shadcn/ui components live in `frontend/src/components/ui/`
- Utility function `cn()` is in `frontend/src/lib/utils.ts`
- Prisma schema is at `backend/prisma/schema.prisma`
- Prisma client is generated to `backend/generated/prisma/`
- PrismaService in `backend/src/prisma.service.ts` handles DB connections
- Backend API runs on port 3000, frontend on port 3001 (default Next.js)
