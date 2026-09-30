import { makePuzzle, normalLevel, validSeed } from '../src/sudoku.js';

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Use GET' });
  }
  const level = normalLevel(request.query.level);
  const seed = request.query.seed;
  if (!validSeed(seed)) return response.status(400).json({ error: 'Provide a seed of 1–40 letters, digits, _ or -.' });
  const { puzzle } = makePuzzle(level, seed);
  response.setHeader('Cache-Control', 'public, max-age=60, s-maxage=86400');
  return response.status(200).json({ level, seed, names: ['Vams', 'Yams', 'Vji', 'Obu', 'Sree', 'Teju'], puzzle, box: { rows: 2, columns: 3 } });
}
