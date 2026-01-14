import * as movieService from '../services/movieService.js';

// controllers/movieController.js (agregar)
import { enrichMoviesWithAI } from '../services/aiService.js';

export async function discoverMovies(req, res) {
  try {

    // Obtener el parámetro count de la query, por defecto 10
    const count = parseInt(req.query.count) || 10;
    
    // Validar que count sea un número positivo y no mayor a 20
    const validCount = Math.min(Math.max(count, 1), 20);

    const randomMovies = movieService.getRandomMovies(validCount);
    const enrichedMovies = await enrichMoviesWithAI(randomMovies);
    res.json({ 
        success: true, 
        data: enrichedMovies, 
        count: enrichedMovies.length,
        requested: validCount // muestra cuántas se pidieron
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener recomendaciones' });
  }
}

const sendSuccess = (res, data) => {
  const dataArray = Array.isArray(data) ? data : [data];
  res.json({ success: true, data: dataArray, count: dataArray.length });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

export function getMovies(req, res) {
  const movies = movieService.getAllMovies(req.query);
  sendSuccess(res, movies);
}

export function getMovieById(req, res) {
  const movie = movieService.getMovieById(req.params.id);
  if (!movie) return sendError(res, 404, `Película ID ${req.params.id} no encontrada`);
  sendSuccess(res, movie);
}