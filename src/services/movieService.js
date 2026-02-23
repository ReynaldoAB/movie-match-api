import prisma from '../lib/prisma.js';

// GET all movies
// export async function getAllMovies() {
//   return await prisma.movie.findMany({
//     orderBy: { createdAt: 'desc' }
//   });
// }

export function getGenres() {
  // Devuelve los valores del enum
  return ['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCIFI', 'THRILLER'];
}

export async function getAllMovies(filters = {}) {
  const where = {};

  // Filtro por género
  if (filters.genre) {
    where.genre = filters.genre;
  }

  // Filtro por año exacto
  if (filters.year) {
    where.year = parseInt(filters.year);
  }

  // Filtro por rating mínimo
  if (filters.minRating) {
    where.rating = {
      gte: parseFloat(filters.minRating)
    };
  }

  return await prisma.movie.findMany({
    where,
    include: {
      _count: { select: { reviews: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// GET movie by ID
export async function getMovieById(id) {
  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(id) },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (movie && movie.reviews.length > 0) {
    const avgRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0) / movie.reviews.length;
    movie.avgReviewRating = Math.round(avgRating * 10) / 10;
  }

  return movie;
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
      genre: data.genre, // NUEVO: Aseguramos que el género se guarde correctamente
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

export async function searchMovies(params) {
  const { q, genre, yearMin, yearMax, ratingMin, page = 1, limit = 10 } = params;

  // Construir filtros
  const where = {
    AND: []
  };

  // Búsqueda por título
  if (q) {
    where.AND.push({
      title: { contains: q, mode: 'insensitive' }
    });
  }

  // Filtro por género
  if (genre) {
    where.AND.push({ genre });
  }

  // Rango de años
  if (yearMin || yearMax) {
    const yearFilter = {};
    if (yearMin) yearFilter.gte = parseInt(yearMin);
    if (yearMax) yearFilter.lte = parseInt(yearMax);
    where.AND.push({ year: yearFilter });
  }

  // Rating mínimo
  if (ratingMin) {
    where.AND.push({
      rating: { gte: parseFloat(ratingMin) }
    });
  }

  // Si no hay filtros, eliminar AND vacío
  if (where.AND.length === 0) {
    delete where.AND;
  }

  // Ejecutar consulta con paginación
  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      include: {
        _count: { select: { reviews: true } }
      },
      orderBy: { rating: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    }),
    prisma.movie.count({ where })
  ]);

  return {
    data: movies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  };
}

export async function getMoviesWithoutReviews() {
  return await prisma.movie.findMany({
    where: {
      reviews: { none: {} }
    },
    select: { id: true, title: true, year: true, genre: true }
  });
}

export async function getRecentMovies() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return await prisma.movie.findMany({
    where: {
      createdAt: { gte: weekAgo }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function exportData() {
  const movies = await prisma.movie.findMany({
    include: {
      _count: { select: { reviews: true } },
      reviews: {
        select: { rating: true }
      }
    }
  });

  return movies.map(m => ({
    id: m.id,
    title: m.title,
    year: m.year,
    rating: m.rating,
    genre: m.genre,
    reviewCount: m._count.reviews,
    avgReviewRating: m.reviews.length
      ? (m.reviews.reduce((sum, r) => sum + r.rating, 0) / m.reviews.length).toFixed(1)
      : null
  }));
}

export async function deleteMovieWithReviews(id) {
  // Aunque tenemos onDelete: Cascade, demostraremos transacciones
  return await prisma.$transaction(async (tx) => {
    // 1. Verificar que existe la película
    const movie = await tx.movie.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { reviews: true } } }
    });

    if (!movie) {
      throw new Error('Película no encontrada');
    }

    // 2. Guardar info para el log
    const reviewCount = movie._count.reviews;

    // 3. Eliminar reviews primero (explícitamente)
    await tx.review.deleteMany({
      where: { movieId: parseInt(id) }
    });

    // 4. Eliminar película
    await tx.movie.delete({
      where: { id: parseInt(id) }
    });

    // 5. Retornar resultado
    return {
      deletedMovie: movie.title,
      deletedReviews: reviewCount
    };
  });
}

export async function getMoviesWithoutReviews() {
  return await prisma.movie.findMany({
    where: {
      reviews: { none: {} }
    },
    select: { id: true, title: true, year: true, genre: true }
  });
}

