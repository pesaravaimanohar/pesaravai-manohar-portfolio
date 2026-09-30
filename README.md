# Manohar Pesaravai · Portfolio

A responsive, animated React portfolio for Manohar Pesaravai, a web developer based in Bengaluru. Built with React, Vite, CSS, and accessible browser APIs.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Vercel uses the settings in `vercel.json` to build the site from the repository root and serve the `dist` output. The site includes About, Skills, Projects, My Games, and Contact sections.

## Names Sudoku

Open `/games/sudoku`. The game uses Vams, Yams, Vji, Obu, Sree and Teju as the six symbols. Standard 6×6 Sudoku rules apply to every row, column, and 2×3 box. Easy, Medium and Hard boards have a unique solution. The puzzle link contains a level and seed so anyone opening it gets the same board. Restart clears the current board; New puzzle creates another seed.

`GET /api/sudoku?level=easy&seed=example123` returns the six names, puzzle values (0 means blank), and box dimensions as JSON. The API is a Vercel function; the browser can generate the same puzzle locally when the endpoint is unavailable. No account or database is required.

