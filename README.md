# 🎬 Movie Match API

API REST para gestionar y recomendar películas, construida con Express.js.

## 🚀 Características

- Listar todas las películas
- Obtener película por ID
- Película aleatoria
- Filtros múltiples (género, rating, año, director)
- Rutas organizadas con Express Router

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

**Query Parameters:**
- `genre` - Filtrar por género (case insensitive)
- `minRating` - Rating mínimo (número decimal)
- `year` - Año de lanzamiento (número)
- `director` - Buscar por director (búsqueda parcial, case insensitive)

#### Obtener película por ID
```
GET /movies/:id
```

#### Película aleatoria
```
GET /movies/random
```

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

# Combinar filtros
curl http://localhost:3000/movies?genre=Drama&minRating=9.0&year=1994

# Película específica
curl http://localhost:3000/movies/1

# Película aleatoria
curl http://localhost:3000/movies/random
```

## 🛠️ Tecnologías

- **Express.js** - Framework web
- **Node.js** - Runtime de JavaScript
- **ES Modules** - Módulos JavaScript modernos

## 📝 Respuestas de la API

### Éxito
```json
{
  "id": 1,
  "title": "The Shawshank Redemption",
  "director": "Frank Darabont",
  "year": 1994,
  "genre": "Drama",
  "rating": 9.3
}
```

### Error 404
```json
{
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