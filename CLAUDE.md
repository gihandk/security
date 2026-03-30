# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Travel & Tourism web application with hotel/campsite/attraction bookings, trip planning, reviews, a blog, and email newsletter. Built with a REST API so the same backend supports future mobile apps.

## Architecture

```
security/
├── client/          # React 18 + Vite + Tailwind CSS (frontend, port 5173)
└── server/          # Node.js + Express REST API (backend, port 5000)
    └── prisma/      # Database schema and migrations (PostgreSQL via Neon)
```

**Request flow:** Browser → React (Vite proxy `/api` → port 5000) → Express routes → Prisma → Neon PostgreSQL

**Auth:** JWT stored in `localStorage`. Every protected API request sends `Authorization: Bearer <token>`. The `authenticate` middleware validates the token; `requireAdmin` additionally checks `role === 'ADMIN'`.

## Commands

### Server (run from `server/`)
```bash
npm run dev          # Start with nodemon (auto-restarts on changes)
npm run db:migrate   # Apply new Prisma schema changes to the database
npm run db:studio    # Open Prisma Studio GUI to browse/edit data
npm run db:generate  # Regenerate Prisma client after schema changes
```

### Client (run from `client/`)
```bash
npm run dev          # Start Vite dev server at http://localhost:5173
npm run build        # Production build to dist/
```

Always run server and client in **separate terminals** simultaneously.

## Key Files

- `server/src/index.js` — Express app entry point, all routes registered here
- `server/src/middleware/auth.js` — JWT `authenticate` + `requireAdmin` middleware
- `server/src/routes/` — One file per feature: `auth`, `destinations`, `bookings`, `reviews`, `trips`, `blog`, `newsletter`
- `server/prisma/schema.prisma` — Single source of truth for all database models
- `client/src/context/AuthContext.jsx` — Global auth state (user, login, register, logout)
- `client/src/services/api.js` — Axios instance with auto JWT injection
- `client/src/App.jsx` — All React routes defined here

## Database Models

`User` → `Booking` → `Destination` (HOTEL | CAMPSITE | ATTRACTION)
`User` → `Review` → `Destination`
`User` → `TripPlan` → `TripItem` → `Destination`
`User` → `BlogPost`
`NewsletterSubscriber` (optional link to User)

## Environment Variables

Server `.env` (never commit this file):
- `DATABASE_URL` — Neon PostgreSQL connection string
- `JWT_SECRET` — Sign/verify JWT tokens
- `PORT` — API port (default 5000)
- `CLOUDINARY_*` — Image upload credentials (cloudinary.com)
- `SENDGRID_API_KEY` — Email sending (sendgrid.com)

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/destinations` | — | List with `?type=HOTEL&search=` filters |
| GET | `/api/destinations/:slug` | — | Detail + reviews |
| POST | `/api/destinations` | Admin | Create destination |
| GET | `/api/bookings` | ✓ | User's bookings |
| POST | `/api/bookings` | ✓ | Create booking |
| PUT | `/api/bookings/:id/cancel` | ✓ | Cancel booking |
| GET/POST | `/api/reviews` | ✓ | Submit review |
| GET/POST/DELETE | `/api/trips` | ✓ | Trip plans |
| POST | `/api/trips/:id/items` | ✓ | Add destination to trip |
| GET | `/api/blog` | — | Published posts |
| POST | `/api/blog` | Admin | Create post |
| POST | `/api/newsletter/subscribe` | — | Subscribe |
