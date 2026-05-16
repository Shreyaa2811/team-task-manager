# Team Task Manager (SK)

Team task tracker — sign up, create workspaces, invite teammates, manage tasks.

## Folder layout

```
SK/
  backend/    FastAPI service (MongoDB)
  frontend/   React + Vite UI
```

## Highlights

- JWT login / signup
- Admin and member roles
- Workspaces (projects) with members and per-member project roles
- Tasks: status (todo / in_progress / done), priority (low / medium / high), assignee, due date
- Home view with stats and recent tasks
- Filter tasks by status

## Stack

**Frontend**
- React 18, Vite, Tailwind CSS
- React Context + `useReducer` for state
- `fetch` for HTTP
- `react-icons` for icons
- `react-hook-form` + `zod` for form validation

**Backend**
- FastAPI, Uvicorn
- Motor for async MongoDB
- Pydantic v2
- python-jose for JWT, passlib + bcrypt for password hashing

## Run it

1. Make sure MongoDB is running (default `mongodb://localhost:27017`).
2. Boot the backend: see [`backend/README.md`](backend/README.md). Port `8002`.
3. Boot the frontend: see [`frontend/README.md`](frontend/README.md). Opens at http://localhost:5175

## Test admin (after seeding)

| Field | Value |
| --- | --- |
| Email | `sara@example.com` |
| Password | `sk-password-123` |
| Role | admin |

## URLs

- App: http://localhost:5175
- API: http://localhost:8002/api
- Health: http://localhost:8002/health
