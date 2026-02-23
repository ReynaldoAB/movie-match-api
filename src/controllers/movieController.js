import { 
  getGenres as getGenresService,
  getAllMovies as getAllMoviesService, 
  getMovieById as getMovieByIdService,
  createMovie as createMovieService,
  deleteMovie as deleteMovieService,
  getRandomMoviesWithAI,
  getMoviesByMinRating,
  searchMovies as searchMoviesService,
  getMoviesWithoutReviews as getMoviesWithoutReviewsService,
  getRecentMovies as getRecentMoviesService,
  exportData as exportDataService
} from '../services/movieService.js';

import { enrichMoviesWithAI } from '../services/aiService.js';

const sendSuccess = (res, data) => {
  const dataArray = Array.isArray(data) ? data : [data];
  res.json({ success: true, data: dataArray, count: dataArray.length });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

const VALID_GENRES = ['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCIFI', 'THRILLER'];

export async function discoverMovies(req, res) {
  try {
    const count = parseInt(req.query.count) || 10;
    const validCount = Math.min(Math.max(count, 1), 20);

    const randomMovies = await getRandomMoviesWithAI(validCount);
    const enrichedMovies = await enrichMoviesWithAI(randomMovies);
    
    res.json({ 
      success: true, 
      data: enrichedMovies, 
      count: enrichedMovies.length,
      requested: validCount
    });
  } catch (error) {
    sendError(res, 500, error.message || 'Error al obtener recomendaciones');
  }
}

export function getGenres(req, res) {
  const genres = getGenresService();
  res.json({ success: true, data: genres });
}

// export async function getAllMovies(req, res) {
//   try {
//     const movies = await getAllMoviesService(req.query);
//     sendSuccess(res, movies);
//   } catch (error) {
//     sendError(res, 500, error.message);
//   }
// }

export async function getAllMovies(req, res) {
  try {
    const filters = { ...req.query };

    if (filters.genre) {
      filters.genre = String(filters.genre).trim().toUpperCase();
      if (!VALID_GENRES.includes(filters.genre)) {
        return sendError(
          res,
          400,
          `genre inválido. Valores permitidos: ${VALID_GENRES.join(', ')}`
        );
      }
    }

    if (filters.year) {
      const year = Number.parseInt(filters.year, 10);
      if (Number.isNaN(year)) {
        return sendError(res, 400, 'year debe ser un número entero');
      }
      filters.year = String(year);
    }

    if (filters.minRating) {
      const minRating = Number.parseFloat(filters.minRating);
      if (Number.isNaN(minRating) || minRating < 0 || minRating > 10) {
        return sendError(res, 400, 'minRating debe ser un número entre 0 y 10');
      }
      filters.minRating = String(minRating);
    }

    const movies = await getAllMoviesService(filters);
    const moviesWithReviewCount = movies.map((movie) => ({
      ...movie,
      reviewsCount: movie._count?.reviews ?? 0
    }));

    sendSuccess(res, moviesWithReviewCount);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}

export async function getMovieById(req, res) {
  try {
    const movie = await getMovieByIdService(req.params.id);
    if (!movie) {
      return sendError(res, 404, `Película ID ${req.params.id} no encontrada`);
    }

    res.json({
      success: true,
      data: {
        ...movie,
        reviewsCount: movie.reviews?.length ?? 0
      }
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
}

export async function filterByRating(req, res, next) {
  try {
    const { minRating } = req.query;

    if (!minRating) {
      return res.status(400).json({
        success: false,
        error: 'El parámetro minRating es requerido'
      });
    }

    const rating = parseFloat(minRating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      return res.status(400).json({
        success: false,
        error: 'minRating debe ser un número entre 0 y 10'
      });
    }

    const movies = await getMoviesByMinRating(rating);

    res.json({
      success: true,
      data: movies,
      count: movies.length,
      filter: { minRating: rating }
    });
  } catch (error) {
    next(error);
  }
}

export async function createMovie(req, res) {
  try {
    const newMovie = await createMovieService(req.body);
    res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}

export async function deleteMovie(req, res) {
  try {
    await deleteMovieService(req.params.id);
    res.json({ success: true, message: 'Película eliminada' });
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, 404, `Película ID ${req.params.id} no encontrada`);
    }

    sendError(res, 500, error.message);
  }
}

export async function search(req, res) {
  try {
    const result = await searchMoviesService(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWithoutReviews(req, res) {
  try {
    const movies = await getMoviesWithoutReviewsService();
    res.json({ success: true, data: movies, count: movies.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getRecent(req, res) {
  try {
    const movies = await getRecentMoviesService();
    res.json({ success: true, data: movies, count: movies.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getExportData(req, res) {
  try {
    const data = await exportDataService();
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}



