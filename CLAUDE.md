# TestYourFriends

## Project Structure

Monorepo with two main packages:

- **frontend/**: Next.js 16 app with TypeScript, Tailwind CSS v4, and shadcn/ui
- **backend/**: NestJS app with TypeScript and Prisma ORM (SQLite)

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: NestJS, TypeScript, Prisma 7 (SQLite)
- **Build System**: Turborepo (npm workspaces)
- **UI Components**: shadcn/ui (New York style, CSS variables, Lucide icons)

## Commands

### Turborepo (from root)
- `npm run build` — Build all packages in parallel
- `npm run dev` — Start all dev servers (frontend + backend)
- `npm run lint` — Lint all packages
- `npm run test` — Run all tests

### Filtering (run specific package)
- `turbo run build --filter=frontend` — Build only frontend
- `turbo run test --filter=backend` — Test only backend

### Database
- `npm run db:migrate` — Run Prisma migrations
- `npm run db:generate` — Generate Prisma client
- `npm run db:studio` — Open Prisma Studio

## Key Conventions

- Turborepo manages task orchestration via `turbo.json`
- Root `package.json` only delegates via `turbo run` — never put task logic there
- Each package has its own `build`, `dev`, `lint`, `test` scripts
- Frontend uses `@/*` path alias mapping to `./src/*`
- shadcn/ui components live in `frontend/src/components/ui/`
- Utility function `cn()` is in `frontend/src/lib/utils.ts`
- Prisma schema is at `backend/prisma/schema.prisma`
- Prisma client is generated to `backend/generated/prisma/`
- PrismaModule (`@Global()`) in `backend/src/prisma/` handles DB connections
- Backend API runs on port 3000, frontend on port 3001
- Frontend proxies `/api/*` to backend via `next.config.ts` rewrites
