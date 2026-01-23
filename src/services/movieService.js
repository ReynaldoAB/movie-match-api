// import { movies } from '../data/movies.js';

// export function getAllMovies(filters = {}) {
//   let result = [...movies];
//   if (filters.genre) {
//     result = result.filter(m => m.genre.toLowerCase() === filters.genre.toLowerCase());
//   }
//   if (filters.minRating) {
//     result = result.filter(m => m.rating >= parseFloat(filters.minRating));
//   }
//   return result;
// }

// export function getMovieById(id) {
//   return movies.find(m => m.id === parseInt(id));
// }

// export function getRandomMovies(count = 10) {
//   const shuffled = [...movies].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, Math.min(count, movies.length));
// }

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