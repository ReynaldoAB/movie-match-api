import prisma from '../lib/prisma.js';

// Obtener reviews de una película
export async function getReviewsByMovie(movieId) {
  return await prisma.review.findMany({
    where: { movieId: parseInt(movieId) },
    orderBy: { createdAt: 'desc' }
  });
}

// Crear review para una película
export async function createReview(movieId, data) {
  // Verificar que la película existe
  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(movieId) }
  });

  if (!movie) {
    throw new Error('Película no encontrada');
  }

  return await prisma.review.create({
    data: {
      movieId: parseInt(movieId),
      author: data.author,
      rating: parseInt(data.rating),
      comment: data.comment
    }
  });
}

// Eliminar review
export async function deleteReview(reviewId) {
  return await prisma.review.delete({
    where: { id: parseInt(reviewId) }
  });
}

export async function getMovieById(id) {
  return await prisma.movie.findUnique({
    where: { id: parseInt(id) },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function deleteMovieWithReviews(id) {
  // Aunque tenemos onDelete: Cascade, demostraremos transacciones
  return await prisma.$transaction(async (tx) => {
    // 1. Verificar que existe la película
    const movie = await tx.movie.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { reviews: true } } }
    });

    if (!movie) {
      throw new Error('Película no encontrada');
    }

    // 2. Guardar info para el log
    const reviewCount = movie._count.reviews;

    // 3. Eliminar reviews primero (explícitamente)
    await tx.review.deleteMany({
      where: { movieId: parseInt(id) }
    });

    // 4. Eliminar película
    await tx.movie.delete({
      where: { id: parseInt(id) }
    });

    // 5. Retornar resultado
    return {
      deletedMovie: movie.title,
      deletedReviews: reviewCount
    };
  });
}