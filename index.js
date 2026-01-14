import 'dotenv/config';
import express from 'express';
import moviesRouter from './routes/movies.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a Movie Match API 🎬',
     endpoints: {
       movies: '/movies'
      }
  });
});

app.use('/movies', moviesRouter);
app.listen(PORT, () => console.log(`🎬 API en http://localhost:${PORT}`));