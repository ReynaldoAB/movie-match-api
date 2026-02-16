// middlewares/responseTime.js
// Tip: res.on('finish', callback) se ejecuta cuando la respuesta termina

export function responseTime(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    // Calcula duración y loguea
    // Formato: "GET /movies - 45ms"
  });

  next();
}