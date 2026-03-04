# QuizMaster

A full-stack quiz application with:
- Local username/password authentication
- Google OAuth login
- Timed scoring per question
- Leaderboard and user quiz history

## Tech Stack
- Frontend: React, React Router, Axios, Google OAuth
- Backend: Node.js, Express, Mongoose, JWT, Express Session
- Database: MongoDB

## Project Structure
```text
QuizMaster/
  backend/
  frontend/
```

## Prerequisites
- Node.js 18+ (Node 20 LTS recommended)
- npm
- MongoDB (local or cloud)
- Nodemon for `npm run dev` in backend (`npm install -g nodemon`)

## Environment Variables
Create `backend/.env`:

```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1/quizapp
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=development
```

Create `frontend/.env`:

```env
REACT_APP_API=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

Notes:
- `GOOGLE_CLIENT_ID` and `REACT_APP_GOOGLE_CLIENT_ID` should be the same Google OAuth client ID.
- If `JWT_SECRET` is not set, backend falls back to `SESSION_SECRET`.

## Installation
From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run in Development
Start backend:

```bash
cd backend
npm run dev
```

Start frontend (new terminal):

```bash
cd frontend
npm start
```

App URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Build Frontend
```bash
cd frontend
npm run build
```

## Backend Behavior
- On startup, backend checks `questions` collection.
- If empty, it fetches 50 questions from Open Trivia DB and seeds MongoDB.

## Main API Routes

Health:
- `GET /` -> `{ status: "ok" }`

Users:
- `GET /users`
- `GET /users/:id`
- `POST /users/register`
- `POST /users/login`
- `POST /users/logout`
- `GET /users/me` (auth required)
- `POST /users/auth/google`

Quiz:
- `GET /quiz/leaderboard`
- `GET /quiz/start` (auth required)
- `POST /quiz/submit` (auth required)
- `GET /quiz/finish` (auth required)
- `GET /quiz/history` (auth required)
- `GET /quiz/questions`

## Authentication
- Backend sets an HTTP-only `token` cookie (JWT).
- Session is stored in MongoDB via `connect-mongo`.
- Protected endpoints require valid cookie-based auth.

## Troubleshooting
- `Port 3001 is already in use`:
  - Find process: `netstat -ano | findstr :3001`
  - Kill process (Windows): `taskkill /PID <PID> /F`
- Google login fails:
  - Verify both backend and frontend Google client IDs match.
  - Ensure OAuth client allows correct origins.
- Empty quiz list:
  - Check MongoDB connection and backend startup logs for question seeding.

## Scripts

Backend:
- `npm start` -> run server
- `npm run dev` -> run with nodemon

Frontend:
- `npm start` -> dev server
- `npm run build` -> production build
- `npm test` -> tests
