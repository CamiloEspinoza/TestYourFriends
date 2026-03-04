# Quiz Creator Skill

## Purpose
Create new quizzes for the TestYourFriends platform using the database-driven architecture. All quiz content lives in PostgreSQL via Prisma.

## Architecture

### Data Flow
```
Prisma Seeder → PostgreSQL → NestJS API → Next.js Frontend
```

### Key Models (backend/prisma/schema.prisma)
- `QuizCategory` — Groups quizzes by theme (dark-personality, social, moral, life, pop-culture, relationships)
- `Quiz` — Stores title, description, dimensionLabels (JSON), questions (JSON), characters (JSON)
- `Session` — Links to a Quiz via `quizId` FK
- `Participant` — Stores `scores: Json` (dynamic, not fixed columns)

### API Endpoints (backend/src/quiz/)
- `GET /quizzes` — All active quizzes with category info
- `GET /quizzes/categories` — Categories with their quizzes
- `GET /quizzes/:slug` — Full quiz (questions + characters)

---

## Adding a New Quiz

### Step 1: Create the seeder file

Create `backend/prisma/seeds/quiz-{slug}.ts`:

```typescript
import type { PrismaClient } from '../../generated/prisma/client.js';

export async function seedMyQuiz(prisma: PrismaClient, catMap: Record<string, string>) {
  await prisma.quiz.upsert({
    where: { slug: 'my-quiz' },
    update: {},
    create: {
      slug: 'my-quiz',
      title: 'Quiz Title',
      description: 'One-line description that makes someone want to take it.',
      scenarioLabel: 'Situación',   // Label shown above each question (≤32 chars)
      categoryId: catMap['social'], // One of the 6 category slugs
      sortOrder: 7,                  // Position within category
      dimensionLabels: {
        A: 'Label A',
        B: 'Label B',
        C: 'Label C',
        D: 'Label D',
      },
      questions: [
        {
          id: 1,
          situation: 'Question text here.',
          options: [
            { text: 'Option text', dimension: 'A' },
            { text: 'Option text', dimension: 'B' },
            { text: 'Option text', dimension: 'C' },
            { text: 'Option text', dimension: 'D' },
          ],
        },
        // ... 9 more questions (10 total)
      ],
      characters: [
        // 4 pure (one dimension each)
        { name: 'Character A', dimensions: ['A'], photo: '/characters/a.jpg', description: 'Short tagline.', philosophy: '2-3 sentences about this type.' },
        { name: 'Character B', dimensions: ['B'], photo: '/characters/b.jpg', description: '...', philosophy: '...' },
        { name: 'Character C', dimensions: ['C'], photo: '/characters/c.jpg', description: '...', philosophy: '...' },
        { name: 'Character D', dimensions: ['D'], photo: '/characters/d.jpg', description: '...', philosophy: '...' },
        // 4 hybrid (two dimensions each — cover common combos)
        { name: 'Character AB', dimensions: ['A', 'B'], photo: '/characters/ab.jpg', description: '...', philosophy: '...' },
        { name: 'Character AC', dimensions: ['A', 'C'], photo: '/characters/ac.jpg', description: '...', philosophy: '...' },
        { name: 'Character BD', dimensions: ['B', 'D'], photo: '/characters/bd.jpg', description: '...', philosophy: '...' },
        { name: 'Character CD', dimensions: ['C', 'D'], photo: '/characters/cd.jpg', description: '...', philosophy: '...' },
      ],
    },
  });
}
```

### Step 2: Register in seed.ts

In `backend/prisma/seed.ts`:

```typescript
import { seedMyQuiz } from './seeds/quiz-my-quiz.js';
// ...
{ name: 'my-quiz', fn: () => seedMyQuiz(prisma, catMap) },
```

### Step 3: Run the seeder

```bash
cd backend && pnpm db:seed
```

---

## Quiz Design Rules

### Dimensions
- Exactly **4 dimensions**, each a single uppercase letter (A–Z)
- Each question has exactly **4 options**, one per dimension
- Questions should distribute dimensions roughly equally (target ~2–3 per dimension per quiz)

### Characters (8 total)
- 4 **pure** characters: `dimensions: ['X']` — one per dimension
- 4 **hybrid** characters: `dimensions: ['X', 'Y']` — cover the most common combos
- Character `name` should be a real person, archetype, or cultural reference
- `philosophy`: 2–3 sentences in second person ("Para ti…" / "Tu…")

### Questions (10 total)
- Each `situation` should be a realistic, concrete scenario — not abstract
- Options must be believable responses, not obvious "good vs bad"
- The quiz should reveal something true and surprising about the person

### Virality Factors
- Title must make someone want to share: "¿Qué tan X eres?" or "¿Eres un Y?"
- Description should create curiosity or mild anxiety about the result
- Characters should be recognizable or relatable (real people, cultural archetypes)

---

## Existing Categories

| Slug | Label | Icon |
|------|-------|------|
| `dark-personality` | Personalidad Oscura | Skull |
| `social` | Social y Relaciones | Users |
| `moral` | Moral y Controversia | Scale |
| `life` | Vida y Ambición | Target |
| `pop-culture` | Cultura Pop y Diversión | Gamepad2 |
| `relationships` | Amor y Pareja | Heart |

---

## Existing Quizzes (32 total)

**dark-personality**: psychopath, toxic, narcissist, machiavellian, liar, envious  
**social**: good-friend, social, jealous, drunk, secret-keeper, dramatic  
**moral**: racist, classist, hypocrite, corrupt, superficial + ethics (legacy)  
**life**: ambitious, workaholic, emotionally-mature, materialist, coward, people-pleaser  
**pop-culture**: virtual (legacy), boomer, npc, main-character, millionaire  
**relationships**: red-flag, ex-type, faithful  

---

## File Locations

- Seeder files: `backend/prisma/seeds/quiz-{slug}.ts`
- Main seeder: `backend/prisma/seed.ts`
- Seeder command: `pnpm db:seed` (from `backend/`)
- API service: `backend/src/quiz/quiz.service.ts`
- API controller: `backend/src/quiz/quiz.controller.ts`
- Frontend types: `frontend/src/lib/quiz-api.ts`
- Dynamic quiz page: `frontend/src/app/[locale]/quiz/[slug]/page.tsx`
