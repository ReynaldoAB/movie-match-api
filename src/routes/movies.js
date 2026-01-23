import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

const router = Router();
router.get('/', movieController.getMovies);
router.get('/discover', movieController.discoverMovies);  // ← Agregar ANTES de /:id
router.get('/filter', movieController.getMoviesByRating); // ✅ NUEVO
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie); // ✅ Nueva ruta

export default router;