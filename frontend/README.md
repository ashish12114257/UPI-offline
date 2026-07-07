# UPI Offline Mesh — Frontend

React 19 + TypeScript 6 + Vite 8 dashboard for the offline UPI mesh payment simulator.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The dev server proxies `/api` to `http://localhost:8080` by default.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |

## Environment Variables

Create a `.env` file (see `.env.example`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `/api` | Backend API URL. Use `/api` for dev (Vite proxy). Set to full URL for production. |

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server — remember to configure SPA fallback (all paths serve `index.html`).

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full instructions on deploying to Vercel, Netlify, Railway, and Render.
