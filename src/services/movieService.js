import prisma from '../lib/prisma.js';

// GET all movies
export async function getAllMovies() {
  return await prisma.movie.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

// GET movie by ID
export async function getMovieById(id) {
  return await prisma.movie.findUnique({
    where: { id: parseInt(id) }
  });
}

// GET movies by minimum rating
export async function getMoviesByMinRating(minRating) {
  return await prisma.movie.findMany({
    where: {
      rating: { gte: parseFloat(minRating) }
    },
    orderBy: { rating: 'desc' }
  });
}

// GET random movies
export async function getRandomMovies(count = 10) {
  const movies = await prisma.movie.findMany();
  return movies.sort(() => Math.random() - 0.5).slice(0, count);
}

// POST create movie
export async function createMovie(data) {
  return await prisma.movie.create({
    data: {
      title: data.title,
      year: parseInt(data.year),
      rating: parseFloat(data.rating),
      poster: data.poster || null
    }
  });
}

// PUT update movie
export async function updateMovie(id, data) {
  return await prisma.movie.update({
    where: { id: parseInt(id) },
    data: {
      title: data.title,
      year: parseInt(data.year),
      rating: parseFloat(data.rating),
      poster: data.poster
    }
  });
}

// DELETE movie
export async function deleteMovie(id) {
  return await prisma.movie.delete({
    where: { id: parseInt(id) }
  });
}

// Agregar esta función
export async function getRandomMoviesWithAI(count = 10) {
  const totalMovies = await prisma.movie.count();
  
  if (totalMovies === 0) {
    return [];
  }

  const validCount = Math.min(count, totalMovies);
  
  // Obtener películas aleatorias usando ORDER BY RANDOM()
  const randomMovies = await prisma.$queryRaw`
    SELECT * FROM "Movie" 
    ORDER BY RANDOM() 
    LIMIT ${validCount}
  `;

  return randomMovies;
}