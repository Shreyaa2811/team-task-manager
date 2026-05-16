# Team Task Manager (SK) — Backend

FastAPI service backed by MongoDB. Provides auth, projects, tasks, members.

## Stack

- FastAPI 0.115
- Motor (async MongoDB driver)
- Pydantic v2
- JWT auth (python-jose) + bcrypt password hashing

## Prerequisites

- Python 3.12+
- A running MongoDB instance

## Install

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
APP_ENV=development
PORT=8002
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=sk_team_task_manager
JWT_SECRET=replace-with-long-random-string
JWT_EXPIRES_MINUTES=10080
CLIENT_ORIGIN=http://localhost:5175
```

## Run

```bash
uvicorn app.main:app --reload --port 8002
```

- Health: http://localhost:8002/health
- API: http://localhost:8002/api

## Module layout

```
app/
  routers/        FastAPI routers (auth, users, projects, tasks)
  deps.py         Shared FastAPI dependencies (auth, db, current user)
  settings/       env.py, security.py
  store/          mongo_client.py
  dto/            Pydantic request/response models
  operations/     Business logic (project_ops, task_ops, user_ops)
  domain/         entities.py — shared types
  main.py         App entry point
```
