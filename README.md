# 🎬 Movie Match API

API REST para gestionar y recomendar películas con **Prisma 7**, **PostgreSQL** y análisis de IA usando **Claude Sonnet 4.5**.

## 🚀 Características

- ✅ CRUD completo de películas con Prisma ORM
- ✅ Filtrado por rating mínimo
- ✅ Descubrimiento inteligente con IA
- ✅ Base de datos PostgreSQL (Neon)
- ✅ Documentación interactiva con Swagger
- ✅ Arquitectura modular y escalable
- ✅ Middlewares personalizados (logger, error handler)

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
```

### 4. Configurar Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar el schema a la base de datos
npx prisma db push

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

El servidor estará corriendo en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
movie-match-api/
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   └── prisma.config.ts       # Configuración de Prisma 7
├── src/
│   ├── lib/
│   │   └── prisma.js          # Cliente de Prisma con adapter
│   ├── services/
│   │   ├── movieService.js    # Lógica de negocio
│   │   └── aiService.js       # Integración con OpenRouter
│   ├── controllers/
│   │   └── movieController.js # Controladores de rutas
│   ├── routes/
│   │   └── movies.js          # Definición de rutas
│   ├── middlewares/
│   │   ├── logger.js          # Log de requests
│   │   ├── errorHandler.js    # Manejo de errores
│   │   └── notFound.js        # 404 handler
│   └── docs/
│       └── swagger.yaml       # Documentación OpenAPI
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

### ❤️ Health Check
```http
GET /health
```
Estado del servidor.

### 🎬 Películas

#### Listar todas las películas
```http
GET /movies
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

#### Obtener película por ID
```http
GET /movies/:id
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

#### Descubrir películas con IA 🤖
```http
GET /movies/discover?count=5
```

**Query Parameters:**
- `count` (opcional) - Cantidad de películas (1-20, default: 10)

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
  "count": 1,
  "requested": 5
}
```

#### Crear nueva película
```http
POST /movies
Content-Type: application/json

{
  "title": "Inception",
  "year": 2010,
  "rating": 8.8,
  "poster": "https://example.com/inception.jpg"
}
```

**Campos:**
- `title` (string, requerido)
- `year` (integer, requerido)
- `rating` (float, requerido, 0-10)
- `poster` (string, opcional)

## 📖 Documentación Interactiva

Accede a Swagger UI para probar los endpoints:

```
http://localhost:3000/docs
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** v24+ - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **Prisma 7** - ORM moderno con TypeScript

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Neon** - PostgreSQL serverless (opcional)
- **@prisma/adapter-pg** - Adapter para PostgreSQL

### IA & APIs
- **OpenRouter API** - Gateway a múltiples modelos de IA
- **Claude Sonnet 4.5** - Modelo de lenguaje para enriquecimiento

### Documentación & Herramientas
- **Swagger/OpenAPI 3.0** - Documentación interactiva
- **dotenv** - Gestión de variables de entorno
- **YAML** - Configuración de Swagger

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

### Credenciales Nunca Expuestas

- ✅ `.env` en `.gitignore`
- ✅ `.env.example` como template
- ✅ API Keys nunca en el código
- ✅ Connection strings en variables de entorno

## 🧪 Ejemplos de Uso

### cURL

```bash
# Listar todas las películas
curl http://localhost:3000/movies

# Filtrar por rating
curl "http://localhost:3000/movies/filter?minRating=8.5"

# Descubrir con IA (5 películas)
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

# Obtener por ID
curl http://localhost:3000/movies/1

# Health check
curl http://localhost:3000/health
```

### JavaScript (Fetch API)

```javascript
// Crear película
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

// Filtrar por rating
const highRated = await fetch('http://localhost:3000/movies/filter?minRating=9.0');
const movies = await highRated.json();
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

2. **Configuración en `prisma.config.ts`**
   ```typescript
   export default defineConfig({
     datasource: {
       url: process.env.DATABASE_URL
     }
   });
   ```

3. **Adapter obligatorio**
   ```javascript
   import { PrismaPg } from '@prisma/adapter-pg';
   const prisma = new PrismaClient({ adapter });
   ```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

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