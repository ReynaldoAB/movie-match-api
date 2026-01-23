const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

// function buildPrompt(movies) {
//   const movieList = movies.map(m => `- "${m.title}" (${m.year})`).join('\n');
//   return `Para cada película de la siguiente lista, proporciona:
// - anecdote: Una anécdota corta del rodaje (máximo 50 palabras)
// - funFact: Un dato curioso (máximo 30 palabras)  
// - pitch: Un pitch de venta atractivo (máximo 40 palabras)

// Lista de películas:
// ${movieList}

// IMPORTANTE: Responde ÚNICAMENTE con JSON válido, sin bloques de código markdown, sin backticks, sin explicaciones adicionales.
// Formato exacto: {"enriched":[{"title":"nombre exacto","anecdote":"...","funFact":"...","pitch":"..."}]}`;
// }

function buildPrompt(movies) {
  const movieList = movies.map(m => `- "${m.title}" (${m.year})`).join('\n');
  return `Para cada película de la siguiente lista, proporciona:
- anecdote: Una anécdota corta del rodaje (máximo 50 palabras)
- trivia: Una trivia interesante o dato curioso sobre la película (máximo 60 palabras)
- quote: Una cita famosa memorable de la película con el personaje (máximo 60 palabras)
- funFact: Un hecho curioso de la producción o detrás de cámaras (máximo 40 palabras)

Lista de películas:
${movieList}

IMPORTANTE: 
1. Responde ÚNICAMENTE con JSON válido
2. NO uses bloques de código markdown (sin \`\`\`)
3. ESCAPA correctamente las comillas dobles dentro de los textos
4. Formato exacto: {"enriched":[{"title":"nombre exacto","anecdote":"...","trivia":"...","quote":"...","funFact":"..."}]}`;
}




// 👇 NUEVA FUNCIÓN para limpiar la respuesta
function cleanJsonResponse(content) {
  // Remover bloques de código markdown (```json ... ``` o ``` ... ```)
  let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  // Remover espacios en blanco al inicio y final
  cleaned = cleaned.trim();
  return cleaned;
}

export async function enrichMoviesWithAI(movies) {
  if (!OPENROUTER_API_KEY) {
    return movies.map(m => ({ ...m, ai_enriched: null }));
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: buildPrompt(movies) }]
      })
    });

    const data = await response.json();
    const cleanedContent = cleanJsonResponse(data.choices[0].message.content);
    const parsed = JSON.parse(cleanedContent);

    return movies.map(movie => {
      const enriched = parsed.enriched.find(e =>
        // e.title.toLowerCase() === movie.title.toLowerCase() ||
        movie.title.toLowerCase().includes(e.title.toLowerCase())
      );
      return { ...movie, ai_enriched: enriched || null };
    });
  } catch (error) {
    console.error('Error IA:', error.message);
    return movies.map(m => ({ ...m, ai_enriched: null }));
  }
}