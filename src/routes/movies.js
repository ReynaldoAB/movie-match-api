import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

router.get('/filter', movieController.filterByRating);
router.get('/discover', movieController.discoverMovies);
router.get('/genres', movieController.getGenres);

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie);



export default router;