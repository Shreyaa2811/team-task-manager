# Team Task Manager (SK) — Frontend

A React + Vite app styled with Tailwind. Uses the React Context API + useReducer for state, plain `fetch` for HTTP, and `react-icons` for icons.

## Prerequisites

- Node 18+
- npm 9+
- Backend running on port 8002 (see `../backend/README.md`)

## Install

```bash
npm install
```

## Environment

Copy the example file:

```bash
cp .env.example .env
```

Make sure `.env` contains:

```
VITE_API_BASE_URL=http://localhost:8002/api
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:5175 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run lint` | Run eslint |

## Folder layout

```
src/
  comps/        small UI parts (sideNav, topBar, statBlock, dialogs, ...)
  helpers/      classNames, dateHelpers, tokenStore
  services/     api client + auth/project/task calls
  state/        AppContext + actions + reducer
  styles/       globals.css, theme.css
  views/        screen-level views (home, signIn, register, workspaces, workspaceDetail)
```

## Login (after seeding)

```
email:    sara@example.com
password: sk-password-123
role:     admin
```
