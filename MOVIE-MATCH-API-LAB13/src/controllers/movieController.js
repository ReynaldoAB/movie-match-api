import { 
  getAllMovies as getAllMoviesService, 
  getMovieById as getMovieByIdService,
  createMovie as createMovieService,
  getRandomMoviesWithAI,
  getMoviesByMinRating
} from '../services/movieService.js';

import { enrichMoviesWithAI } from '../services/aiService.js';

const sendSuccess = (res, data) => {
  const dataArray = Array.isArray(data) ? data : [data];
  res.json({ success: true, data: dataArray, count: dataArray.length });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

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

export async function getAllMovies(req, res) {
  try {
    const movies = await getAllMoviesService(req.query);
    sendSuccess(res, movies);
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
    sendSuccess(res, movie);
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