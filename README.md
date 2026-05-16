TEAM TASK MANAGER

A full-stack team collaboration and task management application where users can create projects, manage tasks, assign teammates, and track progress.


LIVE LINKS

Frontend:
https://team-task-manager-sepia-seven.vercel.app

Backend API:
https://team-task-manager-production-0d38.up.railway.app


PROJECT STRUCTURE

SK/
│
├── backend/      FastAPI Backend
├── frontend/     React + Vite Frontend
└── README.txt


FEATURES

- User Signup & Login
- JWT Authentication
- Admin & Member Roles
- Create and Manage Projects
- Task Assignment System
- Task Status Tracking
- Priority Levels
- Dashboard Statistics
- Responsive UI
- Secure Backend API
- MongoDB Database Integration


TECH STACK

Frontend:
- React.js
- Vite
- Tailwind CSS
- Axios
- React Hook Form
- Zod

Backend:
- FastAPI
- MongoDB Atlas
- Motor
- JWT Authentication
- Pydantic
- Uvicorn


DEPLOYMENT

Frontend Deployment:
- Vercel

Backend Deployment:
- Railway

Database:
- MongoDB Atlas


BACKEND ENVIRONMENT VARIABLES

APP_NAME=Team Task Manager
APP_ENV=production
PORT=8002

MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=sk_team_task_manager

JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRES_MINUTES=10080

CLIENT_ORIGIN=https://team-task-manager-sepia-seven.vercel.app


LOCAL SETUP

1. Clone Repository

git clone https://github.com/Shreyaa2811/team-task-manager.git


2. Backend Setup

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend URL:
http://localhost:8002


3. Frontend Setup

cd frontend
npm install
npm run dev

Frontend URL:
http://localhost:5173


API HEALTH CHECK

https://team-task-manager-production-0d38.up.railway.app/health


AUTHOR

Shreya Chaturvedi

GitHub:
https://github.com/Shreyaa2811
