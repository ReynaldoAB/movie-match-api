# 🎬 Movie Match API

API REST para gestionar y recomendar películas con **Prisma 7**, **PostgreSQL** y análisis de IA usando **Claude Sonnet 4.5**.

## 🚀 Características

- ✅ CRUD completo de películas con Prisma ORM
- ✅ Filtrado por rating mínimo
- ✅ Búsqueda avanzada de películas con paginación
- ✅ Descubrimiento inteligente con IA
- ✅ Endpoints de analytics (`/stats`)
- ✅ Endpoints utilitarios (`/movies/recent`, `/movies/without-reviews`, `/movies/export`)
- ✅ Base de datos PostgreSQL (Neon)
- ✅ Documentación interactiva con Swagger UI
- ✅ Arquitectura modular y escalable
- ✅ Middlewares personalizados (logger, error handler, 404)
- ✅ Manejo de CORS habilitado
- ✅ Health check endpoint

## 📋 Requisitos

- **Node.js** 18 o superior
- **PostgreSQL** (o cuenta en [Neon](https://neon.tech/))
- Cuenta en [OpenRouter](https://openrouter.ai/) (API Key para IA)

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/ReynaldoAB/movie-match-api.git
cd movie-match-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=require
OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui
NODE_ENV=development
```

### 4. Configurar Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar el schema a la base de datos
npx prisma db push

# (Opcional) Poblar datos iniciales
node prisma/seed.js

# (Opcional) Ver base de datos en navegador
npx prisma studio
```

### 5. Iniciar el servidor

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en:
- 🌐 API: `http://localhost:3000`
- 📚 Documentación: `http://localhost:3000/docs`

## 📁 Estructura del Proyecto

```
movie-match-api/
├── prisma.config.ts          # Configuración de Prisma 7 (datasource.url)
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   └── seed.js                # Seed de datos de películas
├── src/
│   ├── lib/
│   │   └── prisma.js          # Cliente de Prisma con adapter
│   ├── services/
│   │   ├── movieService.js    # Lógica de negocio de películas
│   │   ├── reviewServices.js  # Lógica de reviews
│   │   ├── statsService.js    # Lógica de estadísticas dashboard
│   │   ├── aiService.js       # Integración con OpenRouter
│   │   └── ...
│   ├── controllers/
│   │   ├── movieController.js # Controladores de películas
│   │   ├── reviewController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── movies.js          # Rutas de películas
│   │   ├── reviewRoutes.js    # Rutas de reviews
│   │   └── statsRoutes.js     # Ruta /stats
│   ├── middlewares/
│   │   ├── logger.js          # Log de requests
│   │   ├── errorHandler.js    # Manejo de errores
│   │   └── notFound.js        # 404 handler
│   └── docs/
│       └── swagger.yaml       # Documentación OpenAPI 3.0
├── .env                       # Variables de entorno (NO subir a Git)
├── .env.example              # Template de variables
├── .gitignore
├── index.js                  # Punto de entrada
├── package.json
└── README.md
```

## 📚 Endpoints Disponibles

### 🏠 Raíz
```http
GET /
```
Información de bienvenida y endpoints disponibles.

**Respuesta:**
```json
{
  "message": "Bienvenido a Movie Match API 🎬",
  "endpoints": {
    "movies": "/movies",
    "moviesSearch": "/movies/search",
    "reviews": "/reviews",
    "stats": "/stats",
    "docs": "/docs",
    "health": "/health"
  }
}
```

### ❤️ Health Check
```http
GET /health
```
Estado del servidor y métricas.

**Respuesta:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-27T...",
  "uptime": 123.456,
  "environment": "development"
}
```

### 🎬 Películas

#### Listar todas las películas
```http
GET /movies
```

**Query Parameters opcionales:**
- `genre` - Género (`ACTION`, `COMEDY`, `DRAMA`, `HORROR`, `SCIFI`, `THRILLER`)
- `year` - Año exacto (entero)
- `minRating` - Rating mínimo (0-10)

**Ejemplos:**
```bash
curl "http://localhost:3000/movies?genre=ACTION"
curl "http://localhost:3000/movies?genre=ACTION&minRating=8"
curl "http://localhost:3000/movies?year=2008"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "year": 1994,
      "rating": 9.3,
      "poster": "https://example.com/poster.jpg",
      "createdAt": "2026-01-23T04:15:51.197Z",
      "updatedAt": "2026-01-23T04:15:51.197Z"
    }
  ],
  "count": 1
}
```

**Validaciones (400):**
- `genre` fuera del enum permitido
- `year` no entero
- `minRating` fuera de rango o no numérico

#### Listar géneros disponibles
```http
GET /movies/genres
```

**Respuesta:**
```json
{
  "success": true,
  "data": ["ACTION", "COMEDY", "DRAMA", "HORROR", "SCIFI", "THRILLER"]
}
```

#### Obtener película por ID
```http
GET /movies/:id
```

**Ejemplo:**
```bash
curl http://localhost:3000/movies/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Inception",
      "year": 2010,
      "rating": 8.8,
      "poster": "https://..."
    }
  ],
  "count": 1
}
```

**Error 404:**
```json
{
  "success": false,
  "error": "Película ID 999 no encontrada"
}
```

#### Filtrar por rating mínimo ⭐
```http
GET /movies/filter?minRating=8.0
```

**Query Parameters:**
- `minRating` (requerido) - Rating mínimo (0-10)

**Ejemplo:**
```bash
# Películas con rating >= 9.0
curl "http://localhost:3000/movies/filter?minRating=9.0"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "year": 1994,
      "rating": 9.3,
      "poster": "..."
    }
  ],
  "count": 1,
  "filter": {
    "minRating": 9.0
  }
}
```

**Validaciones:**
- ❌ Sin `minRating`: Error 400
- ❌ `minRating` fuera de rango (0-10): Error 400
- ❌ `minRating` no numérico: Error 400

#### Descubrir películas con IA 🤖
```http
GET /movies/discover?count=5
```

**Query Parameters:**
- `count` (opcional) - Cantidad de películas (1-20, default: 10)

**Ejemplo:**
```bash
curl "http://localhost:3000/movies/discover?count=5"
```

**Respuesta enriquecida con IA:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Inception",
      "year": 2010,
      "rating": 8.8,
      "poster": "...",
      "ai_enriched": {
        "title": "Inception",
        "anecdote": "Christopher Nolan llevaba 10 años desarrollando el guión...",
        "trivia": "El pasillo giratorio fue construido completamente funcional...",
        "quote": "You mustn't be afraid to dream a little bigger, darling",
        "funFact": "La escena del hotel en gravedad cero tomó 3 semanas de rodaje"
      }
    }
  ],
  "count": 5,
  "requested": 5
}
```

#### Búsqueda avanzada con paginación 🔎
```http
GET /movies/search?q=inception&genre=SCIFI&yearMin=2000&yearMax=2020&ratingMin=8&page=1&limit=10
```

**Query Parameters opcionales:**
- `q` (texto en título, case-insensitive)
- `genre` (enum de géneros)
- `yearMin`, `yearMax` (rango de años)
- `ratingMin` (rating mínimo)
- `page` (default `1`)
- `limit` (default `10`)

**Respuesta:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
```

#### Películas sin reviews
```http
GET /movies/without-reviews
```

#### Películas recientes (últimos 7 días)
```http
GET /movies/recent
```

#### Exportar data de películas
```http
GET /movies/export
```

### 📊 Estadísticas

#### Dashboard stats
```http
GET /stats
```

Incluye, entre otros:
- `totalMovies`
- `totalReviews`
- `avgRating`
- `moviesByGenre`
- `topRated`
- `mostReviewed`
- `recentReviews`

#### Crear nueva película
```http
POST /movies
Content-Type: application/json

{
  "title": "Inception",
  "year": 2010,
  "rating": 8.8,
  "genre": "SCIFI",
  "poster": "https://example.com/inception.jpg"
}
```

**Campos:**
- `title` (string, requerido)
- `year` (integer, requerido)
- `rating` (float, requerido, 0-10)
- `genre` (enum, requerido: `ACTION`, `COMEDY`, `DRAMA`, `HORROR`, `SCIFI`, `THRILLER`)
- `poster` (string, opcional)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Inception",
    "year": 2010,
    "rating": 8.8,
    "poster": "https://example.com/inception.jpg",
    "createdAt": "2026-01-27T...",
    "updatedAt": "2026-01-27T..."
  }
}
```

## 📖 Documentación Interactiva

Accede a **Swagger UI** para probar todos los endpoints de forma interactiva:

```
http://localhost:3000/docs
```

**Características:**
- ✅ Probar endpoints sin código
- ✅ Ver ejemplos de request/response
- ✅ Validación de parámetros en tiempo real
- ✅ Documentación OpenAPI 3.0 completa

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** v24+ - Runtime de JavaScript
- **Express.js** 5.x - Framework web minimalista
- **Prisma 7** - ORM moderno con TypeScript

### Base de Datos
- **PostgreSQL** 16+ - Base de datos relacional
- **Neon** - PostgreSQL serverless (opcional)
- **@prisma/adapter-pg** - Adapter para PostgreSQL

### IA & APIs
- **OpenRouter API** - Gateway a múltiples modelos de IA
- **Claude Sonnet 4.5** - Modelo de lenguaje para enriquecimiento

### Documentación & Herramientas
- **Swagger UI Express** - Documentación interactiva
- **OpenAPI 3.0** - Especificación de API
- **YAML** - Configuración de Swagger
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware de CORS

### Dependencias Principales
```json
{
  "dependencies": {
    "@prisma/adapter-pg": "^7.3.0",
    "@prisma/client": "^7.3.0",
    "cors": "^2.8.5",
    "express": "^5.2.1",
    "pg": "^8.17.2",
    "prisma": "^7.3.0",
    "swagger-ui-express": "^5.0.1",
    "yamljs": "^0.3.0"
  },
  "devDependencies": {
    "@types/node": "^25.2.3",
    "dotenv": "^17.2.3",
    "nodemon": "^3.1.11"
  }
}
```

## 🔐 Seguridad

### Variables de Entorno Protegidas

El archivo `.env` está excluido del control de versiones mediante `.gitignore`:

```gitignore
node_modules/
.env
*.log
.DS_Store
dist/
```

### Mejores Prácticas

- ✅ `.env` en `.gitignore`
- ✅ `.env.example` como template sin credenciales
- ✅ API Keys nunca en el código fuente
- ✅ Connection strings en variables de entorno
- ✅ Validación de inputs en controladores
- ✅ Manejo de errores centralizado
- ✅ CORS configurado para producción

## 🧪 Ejemplos de Uso

### cURL

```bash
# Listar todas las películas
curl http://localhost:3000/movies

# Filtrar por rating >= 8.5
curl "http://localhost:3000/movies/filter?minRating=8.5"

# Descubrir 5 películas con IA
curl "http://localhost:3000/movies/discover?count=5"

# Crear película
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "year": 1999,
    "rating": 8.7,
    "poster": "https://example.com/matrix.jpg"
  }'

# Obtener película por ID
curl http://localhost:3000/movies/1

# Health check
curl http://localhost:3000/health

# Búsqueda avanzada
curl "http://localhost:3000/movies/search?q=matrix&ratingMin=8&page=1&limit=5"

# Películas recientes
curl http://localhost:3000/movies/recent

# Películas sin reviews
curl http://localhost:3000/movies/without-reviews

# Dashboard stats
curl http://localhost:3000/stats
```

### JavaScript (Fetch API)

```javascript
// Crear película
const createMovie = async () => {
  const response = await fetch('http://localhost:3000/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Interstellar',
      year: 2014,
      rating: 8.6,
      poster: 'https://example.com/interstellar.jpg'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Filtrar por rating
const getHighRated = async () => {
  const response = await fetch('http://localhost:3000/movies/filter?minRating=9.0');
  const movies = await response.json();
  console.log(movies);
};

// Descubrir con IA
const discover = async () => {
  const response = await fetch('http://localhost:3000/movies/discover?count=5');
  const enriched = await response.json();
  console.log(enriched);
};
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

// Listar películas
const movies = await api.get('/movies');

// Filtrar por rating
const filtered = await api.get('/movies/filter', {
  params: { minRating: 8.0 }
});

// Crear película
const newMovie = await api.post('/movies', {
  title: 'Pulp Fiction',
  year: 1994,
  rating: 8.9
});
```

## 🎯 Migración a Prisma 7

Este proyecto usa **Prisma 7** con cambios arquitectónicos importantes:

### Cambios Clave

1. **No más `url` en schema.prisma**
   ```prisma
   datasource db {
     provider = "postgresql"
     // ❌ url = env("DATABASE_URL") <- Ya no se usa
   }
   ```

2. **Configuración en `prisma.config.ts` (raíz del proyecto)**
   ```typescript
   export default defineConfig({
     datasource: {
       url: process.env.DATABASE_URL
     }
   });
   ```

3. **Adapter obligatorio en cliente**
   ```javascript
   import { PrismaPg } from '@prisma/adapter-pg';
   import pg from 'pg';
   
   const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
   const adapter = new PrismaPg(pool);
   const prisma = new PrismaClient({ adapter });
   ```

### Comandos de Prisma

```bash
# Generar cliente
npx prisma generate

# Aplicar cambios al schema
npx prisma db push

# Poblar datos de ejemplo
node prisma/seed.js

# Ver base de datos
npx prisma studio

# Migración (producción)
npx prisma migrate dev --name nombre-migracion
```

## 🚀 Despliegue

### Railway / Render / Vercel

1. Conecta tu repositorio de GitHub
2. Configura variables de entorno:
   - `DATABASE_URL`
   - `OPENROUTER_API_KEY`
   - `NODE_ENV=production`
3. Comando de build: `npx prisma generate`
4. Comando de inicio: `npm start`

### Docker (Opcional)

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Guía de Estilo

- ✅ Usar ES Modules (`import/export`)
- ✅ Nombres descriptivos en inglés
- ✅ Comentarios en español
- ✅ Async/await sobre callbacks
- ✅ Manejo de errores con try/catch
- ✅ Validación de inputs

## 🐛 Troubleshooting

### Error: Cannot find module 'express'
```bash
npm install
```

### Error: Prisma Client is not generated
```bash
npx prisma generate
```

### Error 500 en /movies/discover
Verifica que `OPENROUTER_API_KEY` esté configurada en `.env`

### Puerto 3000 en uso
Cambia `PORT=3001` en `.env` o mata el proceso:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Reynaldo Arias**
- GitHub: [@ReynaldoAB](https://github.com/ReynaldoAB)
- LinkedIn: [Reynaldo Arias](https://www.linkedin.com/in/reynaldoab)

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**

🐛 **¿Encontraste un bug?** [Reportar issue](https://github.com/ReynaldoAB/movie-match-api/issues)

📫 **¿Preguntas?** Abre una [discusión](https://github.com/ReynaldoAB/movie-match-api/discussions)

💡 **Ideas de mejora:**
- [ ] Autenticación JWT
- [ ] Caché con Redis
- [ ] Paginación en listados
- [ ] Rate limiting
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions