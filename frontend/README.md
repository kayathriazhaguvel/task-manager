# Task Manager — Frontend

React (Vite) frontend for the Employee Task Management System.

## Setup

```bash
cd frontend
npm install
cp .env.example .env    # adjust VITE_API_URL if your backend runs elsewhere
npm run dev              # http://localhost:5173
```

The backend must be running (see `../backend/README.md`) for login and task data to work.

## What's included

- **Auth**: Register / Login pages, JWT stored in `localStorage`, session restored on refresh via `/api/auth/me`.
- **Protected routes**: `ProtectedRoute` redirects to `/login` if there's no valid session.
- **Dashboard**: summary cards (total / completed / pending / high priority), search box, status/priority filters, sort controls, and a responsive task grid.
- **Task CRUD**: create, view detail, edit, delete, and a one-click "Mark Completed/Pending" toggle.
- **UX states**: loading spinners, inline error banners, and an empty-state message when no tasks match the filters.
- **Responsive design**: grid layouts collapse from 4 → 2 → 1 columns down to mobile widths (see `src/styles/index.css`).

## Project structure

```
frontend/src/
├── api/api.js               # fetch wrapper for the backend API
├── context/AuthContext.jsx  # auth state, login/register/logout
├── components/               # Navbar, TaskCard, SummaryCards, TaskFilters, ProtectedRoute, Loader, ErrorMessage
├── pages/                    # Login, Register, Dashboard, TaskDetail, TaskFormPage
├── styles/index.css          # global responsive styles
├── App.jsx                   # routes
└── main.jsx                  # entry point
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```
