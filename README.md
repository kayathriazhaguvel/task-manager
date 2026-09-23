# Employee Task Management System

Full-stack fresher assessment project: React frontend + Node.js/Express backend + MongoDB, with JWT auth, task CRUD, search/filter/sort, and a summary dashboard.

## Quick start

Open two terminals.

**Terminal 1 — backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open `http://localhost:5173`, register an account, and log in.

## Structure

```
task-manager/
├── backend/     # Express API — see backend/README.md for full API docs
└── frontend/    # React app — see frontend/README.md
```

## Requirements coverage

| Spec section | Where it's implemented |
|---|---|
| Auth (login, protected routes, hashed passwords) | `backend/controllers/authController.js`, `backend/middleware/auth.js`, bcrypt in `models/User.js` |
| Dashboard summary | `GET /api/tasks` returns a `summary` object; rendered by `frontend/src/components/SummaryCards.jsx` |
| Task CRUD + mark completed/pending | `backend/controllers/taskController.js`; `frontend/src/pages/TaskFormPage.jsx`, `TaskDetail.jsx`, `TaskCard.jsx` |
| Search / filter / sort | `GET /api/tasks` query params; `frontend/src/components/TaskFilters.jsx` |
| Validation & error handling | Field validation in controllers, centralized `errorHandler.js`, meaningful HTTP status codes throughout |
| Database via env vars | `backend/config/db.js` reads `MONGO_URI` from `.env` (never hard-coded) |
| Responsive frontend | `frontend/src/styles/index.css` (grid breakpoints at 900px / 480px) |
| Clean project structure | Backend separated into `routes/controllers/models/middleware/config`; frontend into `pages/components/context/api` |

## Notes / assumptions made

- The spec's API table lists `POST /api/auth/login` but no way to create a user — a `POST /api/auth/register` endpoint was added so the login flow is actually testable end-to-end. This is called out in `backend/README.md`.
- MongoDB + Mongoose was used (the spec allowed MongoDB or PostgreSQL).
- Dashboard summary counts are computed server-side per request rather than a separate endpoint, since the spec's endpoint table didn't list one — it's included in the existing `GET /api/tasks` response.
