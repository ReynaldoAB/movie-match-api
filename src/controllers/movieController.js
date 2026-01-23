// import * as movieService from '../services/movieService.js';

// // controllers/movieController.js (agregar)
// import { enrichMoviesWithAI } from '../services/aiService.js';



// export async function discoverMovies(req, res) {
//   try {

//     // Obtener el parámetro count de la query, por defecto 10
//     const count = parseInt(req.query.count) || 10;
    
//     // Validar que count sea un número positivo y no mayor a 20
//     const validCount = Math.min(Math.max(count, 1), 20);

//     const randomMovies = movieService.getRandomMovies(validCount);
//     const enrichedMovies = await enrichMoviesWithAI(randomMovies);
//     res.json({ 
//         success: true, 
//         data: enrichedMovies, 
//         count: enrichedMovies.length,
//         requested: validCount // muestra cuántas se pidieron
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Error al obtener recomendaciones' });
//   }
// }

// const sendSuccess = (res, data) => {
//   const dataArray = Array.isArray(data) ? data : [data];
//   res.json({ success: true, data: dataArray, count: dataArray.length });
// };

// const sendError = (res, status, message) => {
//   res.status(status).json({ success: false, error: message });
// };

// export function getMovies(req, res) {
//   const movies = movieService.getAllMovies(req.query);
//   sendSuccess(res, movies);
// }

// export function getMovieById(req, res) {
//   const movie = movieService.getMovieById(req.params.id);
//   if (!movie) return sendError(res, 404, `Película ID ${req.params.id} no encontrada`);
//   sendSuccess(res, movie);
// }

import * as movieService from '../services/movieService.js';
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

    const randomMovies = await movieService.getRandomMovies(validCount);
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

export async function getMovies(req, res) {
  try {
    const movies = await movieService.getAllMovies(req.query);
    sendSuccess(res, movies);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}

export async function getMovieById(req, res) {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) {
      return sendError(res, 404, `Película ID ${req.params.id} no encontrada`);
    }
    sendSuccess(res, movie);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}

export async function getMoviesByRating(req, res) {
  try {
    const minRating = req.query.minRating;
    
    if (!minRating) {
      return sendError(res, 400, 'El parámetro minRating es requerido');
    }

    const rating = parseFloat(minRating);
    
    if (isNaN(rating) || rating < 0 || rating > 10) {
      return sendError(res, 400, 'El rating debe ser un número entre 0 y 10');
    }

    const movies = await movieService.getMoviesByMinRating(rating);
    sendSuccess(res, movies);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}

export async function createMovie(req, res) {
  try {
    const newMovie = await movieService.createMovie(req.body);
    res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}