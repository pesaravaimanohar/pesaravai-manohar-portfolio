export const NAMES = ['Vams', 'Yams', 'Vji', 'Obu', 'Sree', 'Teju'];
export const LEVELS = {
  easy: { label: 'Easy', clues: 24 },
  medium: { label: 'Medium', clues: 20 },
  hard: { label: 'Hard', clues: 16 },
};

const SIZE = 6;
const box = (r, c) => Math.floor(r / 2) * 2 + Math.floor(c / 3);

function random(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let n = state;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(values, rng) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function validSeed(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,40}$/.test(value);
}

export function normalLevel(value) {
  return Object.hasOwn(LEVELS, value) ? value : 'easy';
}

function seedNumber(seed) {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function solutionFor(rng) {
  const bands = shuffle([0, 1, 2], rng);
  const stacks = shuffle([0, 1], rng);
  const rows = bands.flatMap(b => shuffle([b * 2, b * 2 + 1], rng));
  const cols = stacks.flatMap(s => shuffle([s * 3, s * 3 + 1, s * 3 + 2], rng));
  const digits = shuffle([1, 2, 3, 4, 5, 6], rng);
  return rows.flatMap(r => cols.map(c => digits[(r * 3 + Math.floor(r / 2) + c) % SIZE]));
}

export function candidates(board, index) {
  if (board[index]) return [];
  const r = Math.floor(index / SIZE);
  const c = index % SIZE;
  const used = new Set();
  for (let i = 0; i < SIZE; i++) {
    used.add(board[r * SIZE + i]);
    used.add(board[i * SIZE + c]);
  }
  for (let i = 0; i < 36; i++) {
    if (box(Math.floor(i / SIZE), i % SIZE) === box(r, c)) used.add(board[i]);
  }
  return [1, 2, 3, 4, 5, 6].filter(value => !used.has(value));
}

export function countSolutions(board, limit = 2) {
  const working = [...board];
  let count = 0;
  function visit() {
    let best = -1;
    let options = [];
    for (let i = 0; i < 36; i++) {
      if (working[i]) continue;
      const possible = candidates(working, i);
      if (!possible.length) return;
      if (best === -1 || possible.length < options.length) {
        best = i;
        options = possible;
      }
    }
    if (best === -1) { count++; return; }
    for (const value of options) {
      working[best] = value;
      visit();
      working[best] = 0;
      if (count >= limit) return;
    }
  }
  visit();
  return count;
}

export function makePuzzle(level = 'easy', seed = 'vams-2026') {
  level = normalLevel(level);
  if (!validSeed(seed)) throw new Error('Invalid puzzle seed');
  const rng = random(seedNumber(`${level}:${seed}`));
  const target = LEVELS[level].clues;
  let best = null;
  for (let attempt = 0; attempt < 12; attempt++) {
    const solution = solutionFor(rng);
    const puzzle = [...solution];
    for (const index of shuffle(Array.from({ length: 36 }, (_, i) => i), rng)) {
      if (puzzle.filter(Boolean).length <= target) break;
      const saved = puzzle[index];
      puzzle[index] = 0;
      if (countSolutions(puzzle) !== 1) puzzle[index] = saved;
    }
    if (!best || puzzle.filter(Boolean).length < best.puzzle.filter(Boolean).length) best = { puzzle, solution };
    if (puzzle.filter(Boolean).length === target) break;
  }
  return { level, seed, puzzle: best.puzzle, solution: best.solution };
}

export function conflicts(board) {
  const bad = new Set();
  for (let i = 0; i < 36; i++) {
    if (!board[i]) continue;
    const r = Math.floor(i / SIZE), c = i % SIZE;
    for (let j = i + 1; j < 36; j++) {
      if (board[j] !== board[i]) continue;
      const otherR = Math.floor(j / SIZE), otherC = j % SIZE;
      if (r === otherR || c === otherC || box(r, c) === box(otherR, otherC)) {
        bad.add(i); bad.add(j);
      }
    }
  }
  return bad;
}
