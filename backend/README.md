# Task Manager — Backend

Node.js / Express / MongoDB (Mongoose) REST API for the Employee Task Management System.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev             # nodemon, auto-restarts on changes
# or
npm start
```

Requires a running MongoDB instance (local or Atlas) — see `.env.example` for `MONGO_URI`.

## Environment variables (`.env`)

| Variable         | Description                                   |
|------------------|------------------------------------------------|
| `MONGO_URI`      | MongoDB connection string                      |
| `JWT_SECRET`     | Secret used to sign auth tokens                 |
| `PORT`           | Port the server listens on (default `5000`)     |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                       |

`.env` is git-ignored — never commit real credentials. `.env.example` shows the required shape only.

## API Reference

Base URL: `http://localhost:5000/api`

All `/api/tasks/*` routes require an `Authorization: Bearer <token>` header.

### Auth

**POST `/api/auth/register`** — create an account (not in the original spec's endpoint table, but needed so a login can actually happen).
```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
// 201 Response
{ "success": true, "data": { "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }, "token": "..." } }
```

**POST `/api/auth/login`**
```json
// Request
{ "email": "jane@example.com", "password": "secret123" }
// 200 Response
{ "success": true, "data": { "user": { "id": "...", "name": "Jane Doe", "email": "..." }, "token": "..." } }
```
Invalid credentials → `401` with `{ "success": false, "message": "Invalid email or password" }`.

**GET `/api/auth/me`** — returns the logged-in user (requires token).

### Tasks

**GET `/api/tasks`** — list the logged-in user's tasks. Also returns a `summary` object (total / completed / pending / highPriority) used by the dashboard.

Query params (all optional, combinable):
| Param      | Values                          | Example                  |
|------------|----------------------------------|---------------------------|
| `search`   | text, matched against title      | `?search=report`          |
| `status`   | `Pending` \| `Completed`         | `?status=Pending`          |
| `priority` | `Low` \| `Medium` \| `High`      | `?priority=High`           |
| `sortBy`   | `dueDate` \| `priority` \| `title` | `?sortBy=dueDate`        |
| `order`    | `asc` \| `desc` (default `asc`) | `?order=desc`              |

```json
// 200 Response
{
  "success": true,
  "count": 2,
  "summary": { "total": 2, "completed": 1, "pending": 1, "highPriority": 1 },
  "data": [ { "_id": "...", "title": "...", "description": "...", "dueDate": "...", "priority": "High", "status": "Pending", "user": "..." } ]
}
```

**GET `/api/tasks/:id`** — get a single task. `404` if it doesn't exist or doesn't belong to the user.

**POST `/api/tasks`**
```json
// Request
{ "title": "Write report", "description": "Q3 summary", "dueDate": "2026-10-01", "priority": "High", "status": "Pending" }
```
`priority` and `status` are optional (default to `Medium` / `Pending`).

**PUT `/api/tasks/:id`** — partial update; send only the fields you want to change (e.g. `{ "status": "Completed" }` to mark a task done).

**DELETE `/api/tasks/:id`**

### Error format

All errors follow the same shape:
```json
{ "success": false, "message": "Human readable explanation" }
```
Common status codes: `400` validation, `401` auth, `404` not found, `409` conflict (duplicate email), `500` unexpected server error (details hidden outside development mode).

## Project structure

```
backend/
├── config/db.js            # MongoDB connection
├── controllers/             # Request handlers
├── middleware/
│   ├── auth.js               # JWT verification
│   └── errorHandler.js       # Centralized error handling + 404
├── models/                  # Mongoose schemas (User, Task)
├── routes/                  # Express routers
├── app.js                   # Express app (middleware + routes)
└── server.js                # Entry point (connects DB, starts server)
```

## Testing

Import the routes above into Postman/Thunder Client/Insomnia. Suggested checks:
- Register → Login → use returned token for `/api/tasks`.
- Create a task with a missing field → expect `400`.
- Fetch/update/delete a task with a bogus id → expect `400`/`404`.
- Fetch another user's task id while logged in as a different user → expect `404` (tasks are scoped per-user).
