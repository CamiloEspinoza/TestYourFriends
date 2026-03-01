# TestYourFriends

## Project Structure

Monorepo with two main packages:

- **frontend/**: Next.js 16 app with TypeScript, Tailwind CSS v4, and shadcn/ui
- **backend/**: NestJS app with TypeScript and Prisma ORM (SQLite)

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: NestJS, TypeScript, Prisma 7 (SQLite)
- **Build System**: Turborepo (pnpm workspaces)
- **UI Components**: shadcn/ui (New York style, CSS variables, Lucide icons)

## Commands

### Turborepo (from root)
- `pnpm build` — Build all packages in parallel
- `pnpm dev` — Start all dev servers (frontend + backend)
- `pnpm lint` — Lint all packages
- `pnpm test` — Run all tests

### Filtering (run specific package)
- `pnpm turbo run build --filter=frontend` — Build only frontend
- `pnpm turbo run test --filter=backend` — Test only backend

### Database
- `pnpm db:migrate` — Run Prisma migrations
- `pnpm db:generate` — Generate Prisma client
- `pnpm db:studio` — Open Prisma Studio

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
