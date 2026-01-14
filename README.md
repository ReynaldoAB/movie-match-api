# 🎬 Movie Match API

API REST para gestionar y recomendar películas, construida con Express.js.

## 🚀 Características

- ✅ Listar todas las películas
- ✅ Obtener película por ID
- ✅ Película aleatoria
- ✅ Filtros múltiples (género, rating, año, director)
- ✅ Ordenamiento por cualquier campo
- ✅ Paginación de resultados
- ✅ Estadísticas de la colección
- ✅ Rutas organizadas con Express Router

## 📋 Requisitos

- Node.js 14 o superior
- npm o yarn

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ReynaldoAB/movie-match-api.git

# Entrar al directorio
cd movie-match-api

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 Endpoints

### Raíz
```
GET /
```
Devuelve información de bienvenida y lista de endpoints disponibles.

### Películas

#### Listar todas las películas
```
GET /movies
```

#### Filtrar películas
```
GET /movies?genre=Sci-Fi
GET /movies?minRating=9.0
GET /movies?year=1994
GET /movies?director=nolan
GET /movies?genre=Action&minRating=8.5
```

**Query Parameters para Filtros:**
- `genre` - Filtrar por género (case insensitive)
- `minRating` - Rating mínimo (número decimal)
- `year` - Año de lanzamiento (número)
- `director` - Buscar por director (búsqueda parcial, case insensitive)

#### Ordenar películas
```
GET /movies?sortBy=rating&order=desc
GET /movies?sortBy=year&order=asc
GET /movies?sortBy=title&order=asc
```

**Query Parameters para Ordenamiento:**
- `sortBy` - Campo por el cual ordenar (rating, year, title, etc.)
- `order` - Orden: `asc` (ascendente) o `desc` (descendente)

#### Paginación
```
GET /movies?page=1&limit=5
GET /movies?page=2&limit=10
```

**Query Parameters para Paginación:**
- `page` - Número de página (por defecto: 1)
- `limit` - Películas por página (por defecto: todas)

#### Combinar filtros, ordenamiento y paginación
```
GET /movies?genre=Sci-Fi&sortBy=rating&order=desc&page=1&limit=5
GET /movies?minRating=8.5&year=1994&sortBy=title&order=asc
```

#### Obtener película por ID
```
GET /movies/:id
```

#### Película aleatoria
```
GET /movies/random
```

#### Estadísticas de la colección
```
GET /movies/stats
```

Devuelve información estadística sobre todas las películas:
- Total de películas
- Distribución por género
- Rating promedio
- Película mejor valorada
- Películas más antigua y más reciente

## 📦 Estructura del Proyecto

```
movie-match-api/
├── data/
│   └── movies.js       # Datos de películas
├── routes/
│   └── movies.js       # Rutas de películas
├── index.js            # Archivo principal
├── package.json
└── README.md
```

## 🎯 Ejemplos de Uso

```bash
# Todas las películas
curl http://localhost:3000/movies

# Películas de ciencia ficción
curl http://localhost:3000/movies?genre=Sci-Fi

# Películas con rating 9.0 o mayor
curl http://localhost:3000/movies?minRating=9.0

# Películas de Christopher Nolan
curl http://localhost:3000/movies?director=nolan

# Top 5 películas mejor valoradas
curl http://localhost:3000/movies?sortBy=rating&order=desc&limit=5

# Películas de acción de 2008, ordenadas por rating
curl http://localhost:3000/movies?genre=Action&year=2008&sortBy=rating&order=desc

# Segunda página de películas (5 por página)
curl http://localhost:3000/movies?page=2&limit=5

# Combinar todo: Sci-Fi, rating > 8.5, ordenadas, paginadas
curl http://localhost:3000/movies?genre=Sci-Fi&minRating=8.5&sortBy=rating&order=desc&page=1&limit=3

# Película específica
curl http://localhost:3000/movies/1

# Película aleatoria
curl http://localhost:3000/movies/random

# Estadísticas de la colección
curl http://localhost:3000/movies/stats
```

## 🛠️ Tecnologías

- **Express.js** - Framework web
- **Node.js** - Runtime de JavaScript
- **ES Modules** - Módulos JavaScript modernos

## 📝 Respuestas de la API

### Lista de películas (sin paginación)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "director": "Frank Darabont",
      "year": 1994,
      "genre": "Drama",
      "rating": 9.3
    }
  ],
  "count": 1
}
```

### Lista con paginación
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 15,
    "itemsPerPage": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Estadísticas
```json
{
  "success": true,
  "stats": {
    "totalMovies": 15,
    "byGenre": {
      "Drama": 4,
      "Crime": 4,
      "Action": 2,
      "Sci-Fi": 4,
      "Animation": 1
    },
    "averageRating": 8.73,
    "highestRated": {
      "title": "The Shawshank Redemption",
      "rating": 9.3
    },
    "yearRange": {
      "oldest": { "title": "The Godfather", "year": 1972 },
      "newest": { "title": "Interstellar", "year": 2014 }
    }
  }
}
```

### Error 404
```json
{
  "success": false,
  "error": "Película no encontrada"
}
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👤 Autor

**Reynaldo Arias**
- GitHub: [@ReynaldoAB](https://github.com/ReynaldoAB)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!