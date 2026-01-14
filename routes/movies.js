import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

const router = Router();
router.get('/', movieController.getMovies);
router.get('/discover', movieController.discoverMovies);  // ← Agregar ANTES de /:id
router.get('/:id', movieController.getMovieById);

export default router;