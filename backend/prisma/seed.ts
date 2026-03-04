import { config } from 'dotenv';
import { resolve } from 'path';
// Load root .env (monorepo), fallback to backend/.env — mirrors prisma.config.ts
config({ path: resolve(process.cwd(), '..', '.env') });
config();

import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedCategories } from './seeds/categories.js';
import { seedEthics } from './seeds/quiz-ethics.js';
import { seedVirtual } from './seeds/quiz-virtual.js';
import { seedPsychopath } from './seeds/quiz-psychopath.js';
import { seedToxic } from './seeds/quiz-toxic.js';
import { seedNarcissist } from './seeds/quiz-narcissist.js';
import { seedMachiavellian } from './seeds/quiz-machiavellian.js';
import { seedLiar } from './seeds/quiz-liar.js';
import { seedEnvious } from './seeds/quiz-envious.js';
import { seedGoodFriend } from './seeds/quiz-good-friend.js';
import { seedSocial } from './seeds/quiz-social.js';
import { seedJealous } from './seeds/quiz-jealous.js';
import { seedDrunk } from './seeds/quiz-drunk.js';
import { seedSecretKeeper } from './seeds/quiz-secret-keeper.js';
import { seedDramatic } from './seeds/quiz-dramatic.js';
import { seedRacist } from './seeds/quiz-racist.js';
import { seedClassist } from './seeds/quiz-classist.js';
import { seedHypocrite } from './seeds/quiz-hypocrite.js';
import { seedCorrupt } from './seeds/quiz-corrupt.js';
import { seedSuperficial } from './seeds/quiz-superficial.js';
import { seedAmbitious } from './seeds/quiz-ambitious.js';
import { seedWorkaholic } from './seeds/quiz-workaholic.js';
import { seedEmotionallyMature } from './seeds/quiz-emotionally-mature.js';
import { seedMaterialist } from './seeds/quiz-materialist.js';
import { seedCoward } from './seeds/quiz-coward.js';
import { seedPeoplePleaser } from './seeds/quiz-people-pleaser.js';
import { seedBoomer } from './seeds/quiz-boomer.js';
import { seedNpc } from './seeds/quiz-npc.js';
import { seedMainCharacter } from './seeds/quiz-main-character.js';
import { seedMillionaire } from './seeds/quiz-millionaire.js';
import { seedRedFlag } from './seeds/quiz-red-flag.js';
import { seedExType } from './seeds/quiz-ex-type.js';
import { seedFaithful } from './seeds/quiz-faithful.js';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  const catMap = await seedCategories(prisma);
  console.log('✓ Categories seeded');

  const seeders = [
    { name: 'ethics',            fn: () => seedEthics(prisma, catMap) },
    { name: 'virtual',           fn: () => seedVirtual(prisma, catMap) },
    { name: 'psychopath',        fn: () => seedPsychopath(prisma, catMap) },
    { name: 'toxic',             fn: () => seedToxic(prisma, catMap) },
    { name: 'narcissist',        fn: () => seedNarcissist(prisma, catMap) },
    { name: 'machiavellian',     fn: () => seedMachiavellian(prisma, catMap) },
    { name: 'liar',              fn: () => seedLiar(prisma, catMap) },
    { name: 'envious',           fn: () => seedEnvious(prisma, catMap) },
    { name: 'good-friend',       fn: () => seedGoodFriend(prisma, catMap) },
    { name: 'social',            fn: () => seedSocial(prisma, catMap) },
    { name: 'jealous',           fn: () => seedJealous(prisma, catMap) },
    { name: 'drunk',             fn: () => seedDrunk(prisma, catMap) },
    { name: 'secret-keeper',     fn: () => seedSecretKeeper(prisma, catMap) },
    { name: 'dramatic',          fn: () => seedDramatic(prisma, catMap) },
    { name: 'racist',            fn: () => seedRacist(prisma, catMap) },
    { name: 'classist',          fn: () => seedClassist(prisma, catMap) },
    { name: 'hypocrite',         fn: () => seedHypocrite(prisma, catMap) },
    { name: 'corrupt',           fn: () => seedCorrupt(prisma, catMap) },
    { name: 'superficial',       fn: () => seedSuperficial(prisma, catMap) },
    { name: 'ambitious',         fn: () => seedAmbitious(prisma, catMap) },
    { name: 'workaholic',        fn: () => seedWorkaholic(prisma, catMap) },
    { name: 'emotionally-mature',fn: () => seedEmotionallyMature(prisma, catMap) },
    { name: 'materialist',       fn: () => seedMaterialist(prisma, catMap) },
    { name: 'coward',            fn: () => seedCoward(prisma, catMap) },
    { name: 'people-pleaser',    fn: () => seedPeoplePleaser(prisma, catMap) },
    { name: 'boomer',            fn: () => seedBoomer(prisma, catMap) },
    { name: 'npc',               fn: () => seedNpc(prisma, catMap) },
    { name: 'main-character',    fn: () => seedMainCharacter(prisma, catMap) },
    { name: 'millionaire',       fn: () => seedMillionaire(prisma, catMap) },
    { name: 'red-flag',          fn: () => seedRedFlag(prisma, catMap) },
    { name: 'ex-type',           fn: () => seedExType(prisma, catMap) },
    { name: 'faithful',          fn: () => seedFaithful(prisma, catMap) },
  ];

  for (const { name, fn } of seeders) {
    await fn();
    console.log(`  ✓ ${name}`);
  }

  console.log('\n🎉 Seed completed successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
