import express from 'express';
import { 
  getAllMovies, 
  getMovieById, 
  createMovie,
  filterByRating,
  discoverMovies
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/filter', filterByRating);
router.get('/discover', discoverMovies);

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);

export default router;