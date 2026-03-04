import type { PrismaClient } from '../../generated/prisma/client.js';

const CATEGORIES = [
  {
    slug: 'dark-personality',
    label: { es: 'Personalidad Oscura', en: 'Dark Personality', fr: 'Personnalité Sombre', de: 'Dunkle Persönlichkeit', it: 'Personalità Oscura', pt: 'Personalidade Sombria' },
    description: { es: 'Descubre tu lado más oscuro', en: 'Discover your darkest side', fr: 'Découvrez votre côté le plus sombre', de: 'Entdecke deine dunkelste Seite', it: 'Scopri il tuo lato più oscuro', pt: 'Descubra seu lado mais sombrio' },
    icon: 'Skull',
    sortOrder: 1,
  },
  {
    slug: 'social',
    label: { es: 'Social y Relaciones', en: 'Social & Relationships', fr: 'Social et Relations', de: 'Soziales & Beziehungen', it: 'Sociale e Relazioni', pt: 'Social e Relacionamentos' },
    description: { es: 'Cómo te relacionas con el mundo', en: 'How you relate to the world', fr: 'Comment vous vous reliez au monde', de: 'Wie du dich zur Welt verhältst', it: 'Come ti relazioni con il mondo', pt: 'Como você se relaciona com o mundo' },
    icon: 'Users',
    sortOrder: 2,
  },
  {
    slug: 'moral',
    label: { es: 'Ética y Moral', en: 'Ethics & Morality', fr: 'Éthique et Morale', de: 'Ethik und Moral', it: 'Etica e Morale', pt: 'Ética e Moral' },
    description: { es: 'Tus principios en situaciones límite', en: 'Your principles in extreme situations', fr: 'Vos principes dans des situations extrêmes', de: 'Deine Prinzipien in Extremsituationen', it: 'I tuoi principi in situazioni estreme', pt: 'Seus princípios em situações extremas' },
    icon: 'Scale',
    sortOrder: 3,
  },
  {
    slug: 'lifestyle',
    label: { es: 'Estilo de Vida', en: 'Lifestyle', fr: 'Mode de Vie', de: 'Lebensstil', it: 'Stile di Vita', pt: 'Estilo de Vida' },
    description: { es: 'Cómo vives y qué priorizas', en: 'How you live and what you prioritize', fr: 'Comment vous vivez et ce que vous priorisez', de: 'Wie du lebst und was du priorisierst', it: 'Come vivi e cosa prioritizzi', pt: 'Como você vive e o que prioriza' },
    icon: 'Target',
    sortOrder: 4,
  },
  {
    slug: 'pop-culture',
    label: { es: 'Cultura Pop', en: 'Pop Culture', fr: 'Culture Pop', de: 'Popkultur', it: 'Cultura Pop', pt: 'Cultura Pop' },
    description: { es: 'Películas, series, música y más', en: 'Movies, series, music and more', fr: 'Films, séries, musique et plus', de: 'Filme, Serien, Musik und mehr', it: 'Film, serie, musica e altro', pt: 'Filmes, séries, música e mais' },
    icon: 'Gamepad2',
    sortOrder: 5,
  },
  {
    slug: 'relationships',
    label: { es: 'Amor y Pareja', en: 'Love & Couples', fr: 'Amour et Couples', de: 'Liebe und Paare', it: 'Amore e Coppia', pt: 'Amor e Casais' },
    description: { es: 'Tu filosofía romántica y emocional', en: 'Your romantic and emotional philosophy', fr: 'Votre philosophie romantique et émotionnelle', de: 'Deine romantische und emotionale Philosophie', it: 'La tua filosofia romantica ed emotiva', pt: 'Sua filosofia romântica e emocional' },
    icon: 'Heart',
    sortOrder: 6,
  },
];

export async function seedCategories(prisma: PrismaClient): Promise<Record<string, string>> {
  for (const cat of CATEGORIES) {
    await prisma.quizCategory.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  const all = await prisma.quizCategory.findMany();
  return Object.fromEntries(all.map((c) => [c.slug, c.id]));
}
