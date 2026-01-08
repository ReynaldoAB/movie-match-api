import { Router } from 'express';
import { movies } from '../data/movies.js';

const router = Router();

// Helpers para respuestas consistentes
const sendSuccess = (res, data) => {
  const arr = Array.isArray(data) ? data : [data];
  res.json({ success: true, data: arr, count: arr.length });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

// GET /movies (con filtros)
router.get('/', (req, res) => {
  let result = movies;

  if (req.query.genre) {
    const genre = req.query.genre.toLowerCase();
    result = result.filter(m => m.genre.toLowerCase() === genre);
  }

  if (req.query.minRating) {
    const minRating = parseFloat(req.query.minRating);
    result = result.filter(m => m.rating >= minRating);
  }

  if (req.query.year) {
    const year = parseInt(req.query.year);
    result = result.filter(m => m.year === year);
  }

  if (req.query.director) {
    const director = req.query.director.toLowerCase();
    result = result.filter(m => m.director.toLowerCase().includes(director));
  }

  // Ordenamiento
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    const order = req.query.order === 'desc' ? -1 : 1;

    result = result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * order;
      if (a[sortBy] > b[sortBy]) return 1 * order;
      return 0;
    });
  }

    // Paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalPages = Math.ceil(result.length / limit);

  const paginatedResult = result.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedResult,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: result.length,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });

  sendSuccess(res, result);
});

// GET /movies/random
router.get('/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  sendSuccess(res, movies[randomIndex]);
});

// GET /movies/stats
router.get('/stats', (req, res) => {
  const totalMovies = movies.length;
  
  // Contar películas por género
  const byGenre = movies.reduce((acc, movie) => {
    acc[movie.genre] = (acc[movie.genre] || 0) + 1;
    return acc;
  }, {});

  // Calcular rating promedio
  const averageRating = (movies.reduce((sum, m) => sum + m.rating, 0) / totalMovies).toFixed(2);

  // Película con mejor rating
  const highestRated = movies.reduce((max, m) => m.rating > max.rating ? m : max);

  // Película más antigua y más reciente
  const oldestMovie = movies.reduce((min, m) => m.year < min.year ? m : min);
  const newestMovie = movies.reduce((max, m) => m.year > max.year ? m : max);

  res.json({
    success: true,
    stats: {
      totalMovies,
      byGenre,
      averageRating: parseFloat(averageRating),
      highestRated: {
        title: highestRated.title,
        rating: highestRated.rating
      },
      yearRange: {
        oldest: { title: oldestMovie.title, year: oldestMovie.year },
        newest: { title: newestMovie.title, year: newestMovie.year }
      }
    }
  });
});


// GET /movies/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return sendError(res, 404, `Película con ID ${id} no encontrada`);
  }

  sendSuccess(res, movie);
});

export default router;