import { useEffect, useMemo, useState } from 'react';
import { conflicts, LEVELS, makePuzzle, NAMES, normalLevel, validSeed } from './sudoku.js';
import './sudoku.css';

function newSeed() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function initialConfig() {
  const params = new URLSearchParams(window.location.search);
  return { level: normalLevel(params.get('level')), seed: validSeed(params.get('seed')) ? params.get('seed') : newSeed() };
}

const emptyNotes = () => Array.from({ length: 36 }, () => []);
const timeLabel = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function SudokuGame() {
  const [config, setConfig] = useState(initialConfig);
  const { level, seed } = config;
  const game = useMemo(() => makePuzzle(level, seed), [level, seed]);
  const [board, setBoard] = useState(game.puzzle);
  const [notes, setNotes] = useState(emptyNotes);
  const [selected, setSelected] = useState(game.puzzle.findIndex(value => !value));
  const [history, setHistory] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [pencil, setPencil] = useState(false);
  const [message, setMessage] = useState('Select a square, then choose a name.');
  const [checking, setChecking] = useState(false);
  const [apiState, setApiState] = useState('');
  const errors = useMemo(() => conflicts(board), [board]);
  const finished = board.every(Boolean) && errors.size === 0;
  const filled = board.filter(Boolean).length;

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('level', level);
    url.searchParams.set('seed', seed);
    window.history.replaceState({}, '', url);
    let cancelled = false;
    fetch(`/api/sudoku?level=${encodeURIComponent(level)}&seed=${encodeURIComponent(seed)}`)
      .then(result => { if (!result.ok) throw new Error('API unavailable'); return result.json(); })
      .then(data => { if (!cancelled) setApiState(JSON.stringify(data.puzzle) === JSON.stringify(game.puzzle) ? 'Puzzle API connected' : 'Playing locally'); })
      .catch(() => { if (!cancelled) setApiState('Playing locally'); });
    return () => { cancelled = true; };
  }, [level, seed, game.puzzle]);

  useEffect(() => {
    if (finished) { setMessage(`Brilliant! You solved the ${LEVELS[level].label.toLowerCase()} puzzle in ${timeLabel(seconds)}.`); return; }
    const timer = window.setInterval(() => setSeconds(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished, level]);

  function changePuzzle(nextLevel = level, nextSeed = newSeed()) {
    const next = makePuzzle(nextLevel, nextSeed);
    setConfig({ level: nextLevel, seed: nextSeed });
    setBoard(next.puzzle);
    setNotes(emptyNotes());
    setHistory([]);
    setSelected(next.puzzle.findIndex(value => !value));
    setSeconds(0);
    setChecking(false);
    setPencil(false);
    setMessage('A fresh puzzle is ready. Good luck!');
  }

  function saveHistory() {
    setHistory(previous => [...previous.slice(-49), { board: [...board], notes: notes.map(item => [...item]) }]);
  }

  function enter(value) {
    if (selected < 0 || game.puzzle[selected] || finished) return;
    saveHistory();
    if (pencil && value) {
      setNotes(previous => previous.map((item, index) => index === selected ? item.includes(value) ? item.filter(v => v !== value) : [...item, value].sort() : item));
      setBoard(previous => previous.map((item, index) => index === selected ? 0 : item));
    } else {
      setBoard(previous => previous.map((item, index) => index === selected ? value : item));
      setNotes(previous => previous.map((item, index) => index === selected ? [] : item));
    }
    setChecking(false);
    setMessage(value ? 'Keep going — each name appears once per row, column and box.' : 'Square cleared.');
  }

  function undo() {
    if (!history.length || finished) return;
    const previous = history.at(-1);
    setBoard(previous.board);
    setNotes(previous.notes);
    setHistory(items => items.slice(0, -1));
    setChecking(false);
    setMessage('Last move undone.');
  }

  function hint() {
    if (finished) return;
    const index = selected >= 0 && !game.puzzle[selected] && board[selected] !== game.solution[selected]
      ? selected : board.findIndex((value, i) => !game.puzzle[i] && value !== game.solution[i]);
    if (index < 0) return;
    saveHistory();
    setSelected(index);
    setBoard(previous => previous.map((value, i) => i === index ? game.solution[i] : value));
    setNotes(previous => previous.map((value, i) => i === index ? [] : value));
    setChecking(false);
    setMessage(`${NAMES[game.solution[index] - 1]} belongs here. You’ve got this!`);
  }

  function check() {
    setChecking(true);
    setMessage(errors.size ? `${errors.size} highlighted squares break a row, column, or box rule.` : 'No duplicate names so far. Keep filling the grid!');
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage('Puzzle link copied. Anyone with the link gets this exact board.');
    } catch {
      setMessage('Copy this page’s address to share the exact puzzle.');
    }
  }

  useEffect(() => {
    const handleKey = event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (/^[1-6]$/.test(event.key)) { event.preventDefault(); enter(Number(event.key)); }
      else if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); enter(0); }
      else if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        setSelected(current => {
          const index = current < 0 ? 0 : current;
          if (event.key === 'ArrowUp') return (index + 30) % 36;
          if (event.key === 'ArrowDown') return (index + 6) % 36;
          if (event.key === 'ArrowLeft') return Math.floor(index / 6) * 6 + (index + 5) % 6;
          return Math.floor(index / 6) * 6 + (index + 1) % 6;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="sudoku-page">
      <a className="sudoku-skip" href="#sudoku-board">Skip to puzzle</a>
      <header className="sudoku-header">
        <a className="sudoku-brand" href="/">MP<span>.</span> <small>/ MY GAMES</small></a>
        <a className="sudoku-home" href="/#games">← Back to portfolio</a>
      </header>
      <main className="sudoku-main">
        <div className="sudoku-intro">
          <div><span className="sudoku-kicker">THE FRIENDS EDITION <span>✦</span> 01 / 06</span>
            <h1>Names<br /><em>Sudoku.</em></h1>
            <p>Six friends. Thirty-six squares. One satisfying solution. A classic 6×6 Sudoku, made personal.</p>
            <div className="sudoku-rule"><span>✳</span> Place each name once in every <strong>row, column and 2×3 box.</strong></div>
          </div>
          <div className="sudoku-doodle" aria-hidden="true"><span>V</span><span>Y</span><span>V</span><span>O</span><span>S</span><span>T</span></div>
        </div>

        <div className="sudoku-workspace">
          <section className="sudoku-card" aria-label="Sudoku puzzle">
            <div className="sudoku-card-head"><div><span className="sudoku-overline">YOUR PUZZLE</span><h2>Find the pattern.</h2></div><span className="sudoku-time" aria-label={`Time ${timeLabel(seconds)}`}>◷ {timeLabel(seconds)}</span></div>
            <div className="sudoku-board" id="sudoku-board" role="grid" aria-label="6 by 6 names Sudoku grid">
              {board.map((value, index) => {
                const row = Math.floor(index / 6), col = index % 6;
                const same = selected >= 0 && board[selected] && value === board[selected];
                const related = selected >= 0 && (row === Math.floor(selected / 6) || col === selected % 6 || (Math.floor(row / 2) === Math.floor(Math.floor(selected / 6) / 2) && Math.floor(col / 3) === Math.floor((selected % 6) / 3)));
                return <button key={index} type="button" role="gridcell" aria-selected={selected === index} aria-label={`Row ${row + 1}, column ${col + 1}: ${value ? NAMES[value - 1] : 'empty'}${game.puzzle[index] ? ', given' : ''}`} className={`sudoku-cell${game.puzzle[index] ? ' given' : ''}${selected === index ? ' selected' : ''}${related ? ' related' : ''}${same ? ' matching' : ''}${errors.has(index) && checking ? ' error' : ''}${col === 2 ? ' box-right' : ''}${row === 1 || row === 3 ? ' box-bottom' : ''}`} onClick={() => setSelected(index)}>
                  {value ? <span>{NAMES[value - 1]}</span> : notes[index].length ? <span className="cell-notes">{[1, 2, 3, 4, 5, 6].map(n => <i key={n}>{notes[index].includes(n) ? NAMES[n - 1].slice(0, 2) : ''}</i>)}</span> : null}
                </button>;
              })}
            </div>
            <div className="sudoku-progress"><span>{filled} / 36 filled</span><span>{LEVELS[level].label} · 2×3 boxes</span></div>
            <div className="sudoku-progress-track"><span style={{ width: `${filled / 36 * 100}%` }} /></div>
          </section>

          <aside className="sudoku-panel">
            <div className="sudoku-level-head"><span className="sudoku-overline">CHOOSE YOUR PACE</span><h2>Difficulty</h2></div>
            <div className="sudoku-levels" role="group" aria-label="Difficulty">
              {Object.entries(LEVELS).map(([key, item]) => <button type="button" key={key} className={level === key ? 'active' : ''} aria-pressed={level === key} onClick={() => { if (key !== level) changePuzzle(key); }}>{item.label}</button>)}
            </div>
            <div className="sudoku-divider" />
            <span className="sudoku-overline">PICK A NAME <span className="sudoku-shortcut">(KEYS 1–6)</span></span>
            <div className="sudoku-names">{NAMES.map((name, index) => <button type="button" key={name} onClick={() => enter(index + 1)} disabled={finished} aria-label={`Place ${name}, key ${index + 1}`}><span>{index + 1}</span>{name}</button>)}</div>
            <div className="sudoku-actions">
              <button type="button" onClick={() => enter(0)} disabled={finished}>⌫ <span>Erase</span></button>
              <button type="button" onClick={undo} disabled={!history.length || finished}>↶ <span>Undo</span></button>
              <button type="button" onClick={() => setPencil(value => !value)} aria-pressed={pencil} className={pencil ? 'active' : ''}>✎ <span>Notes {pencil ? 'on' : 'off'}</span></button>
              <button type="button" onClick={hint} disabled={finished}>✦ <span>Hint</span></button>
            </div>
            <div className="sudoku-message" role="status" aria-live="polite"><span>✳</span><p>{message}</p></div>
            <div className="sudoku-bottom-actions"><button type="button" onClick={check} disabled={finished}>Check board</button><button type="button" onClick={() => { setBoard([...game.puzzle]); setNotes(emptyNotes()); setHistory([]); setSeconds(0); setChecking(false); setMessage('Puzzle restarted. Take another run at it!'); }}>Restart</button></div>
            <div className="sudoku-link-actions"><button type="button" onClick={() => changePuzzle()}>New puzzle ↗</button><button type="button" onClick={share}>Share this puzzle ↗</button></div>
          </aside>
        </div>
        <div className="sudoku-footnote"><span>MADE FOR VAMS, YAMS, VJI, OBU, SREE & TEJU.</span><span>{apiState}</span></div>
      </main>
    </div>
  );
}
