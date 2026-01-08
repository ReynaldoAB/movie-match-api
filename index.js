import express from 'express';
import moviesRouter from './routes/movies.js';

const app = express();
const PORT = 3000;

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a Movie Match API 🎬',
    endpoints: {
      allMovies: 'GET /movies',
      filterByGenre: 'GET /movies?genre=Sci-Fi',
      filterCombined: 'GET /movies?genre=Sci-Fi&minRating=8',
      movieById: 'GET /movies/:id',
      randomMovie: 'GET /movies/random'
    }
  });
});

// Montar el router de películas
app.use('/movies', moviesRouter);

app.listen(PORT, () => {
  console.log(`🎬 Movie Match API corriendo en http://localhost:${PORT}`);
});