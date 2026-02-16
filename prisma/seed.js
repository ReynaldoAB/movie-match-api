import prisma from '../src/lib/prisma.js';
import { movies } from './movies.js';

async function main() {
  await prisma.movie.deleteMany();
  for (const movie of movies) {
    await prisma.movie.create({ data: movie });
  }
  console.log('Seed completado!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());