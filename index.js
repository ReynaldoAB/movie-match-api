import 'dotenv/config';
import express from 'express';
import moviesRouter from './src/routes/movies.js';
import cors from 'cors';

// Importa tus middlewares custom
import { logger } from './src/middlewares/logger.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { notFound } from './src/middlewares/notFound.js';

// Agregar imports al inicio de index.js
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// const prisma = new PrismaClient({
//   log: ['query', 'error', 'warn'],
// });
// export default prisma;

// Cargar el archivo YAML
// Tip: YAML.load() convierte YAML a objeto JavaScript
const swaggerDoc = YAML.load('./src/docs/swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Agregar ruta de documentación ANTES de las rutas de API
// Swagger UI se sirve en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ===== MIDDLEWARES GLOBALES (ANTES de rutas) =====
app.use(cors());           // Permite requests de otros dominios
app.use(express.json());   // Parsea JSON en body de requests
app.use(logger);      // Tu middleware de logging

// ===== RUTAS =====  
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a Movie Match API 🎬',
     endpoints: {
       movies: '/movies'
      }
  });
});

// Health check endpoint
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

// ===== MIDDLEWARES DE ERROR (DESPUÉS de rutas) =====
app.use(notFound);         // Maneja rutas no encontradas
app.use(errorHandler);     // Maneja errores de la app

app.listen(PORT, () => {
  console.log(`🎬 API en http://localhost:${PORT}`);
});

// app.listen(PORT, () => console.log(`🎬 API en http://localhost:${PORT}`));