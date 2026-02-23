import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import moviesRouter from './routes/movies.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

import statsRoutes from './routes/statsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar Swagger YAML desde src/docs/swagger.yaml
const swaggerDoc = YAML.load(join(__dirname, 'docs', 'swagger.yaml'));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(statsRoutes);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ===== MIDDLEWARES GLOBALES =====
app.use(cors());
app.use(express.json());
app.use(logger);

// ===== RUTAS =====
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a Movie Match API 🎬',
    endpoints: {
      movies: '/movies',
      // Endpoints agregados recientemente de búsqueda y reviews
      moviesSearch: '/movies/search',
      reviews: '/reviews',
      stats: '/stats',
      docs: '/docs',
      health: '/health'
    }
  });
});

// favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/movies', moviesRouter);
app.use('/', reviewRoutes);

// ===== MIDDLEWARES DE ERROR =====
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎬 API en http://localhost:${PORT}`);
  console.log(`📚 Docs en http://localhost:${PORT}/docs`);
});