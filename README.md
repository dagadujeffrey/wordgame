# WordGrid

WordGrid is a turn-based multiplayer word strategy game designed for 4×4 tactical battles. This repository contains a full-stack TypeScript implementation with a NestJS backend and a Next.js frontend. The project supports local hot-seat play, online multiplayer powered by WebSockets, and solo matches against adaptive AI opponents.

## Monorepo layout

```
wordgame/
├── backend/   # NestJS API, WebSocket gateway, AI, and scoring logic
├── frontend/  # Next.js + Tailwind web client
└── package.json  # Yarn workspaces entry point
```

## Backend

The backend is built with NestJS and exposes REST + WebSocket endpoints. Highlights:

- **Authentication**: Register/login endpoints with Argon2 password hashing and JWT token issuance.
- **Games module**: In-memory room management, move validation, and endgame scoring using a 4×4 grid engine.
- **Dictionary service**: Lazy loads a local 2–4 letter dictionary with graceful fallbacks.
- **AI module**: Configurable heuristics for easy, medium, and hard CPU opponents.
- **Leaderboard**: Aggregates player performance metrics.

Run the backend locally:

```bash
yarn install
yarn dev:backend
```

The service listens on `http://localhost:3001` by default.

## Frontend

The frontend is a responsive Next.js application styled with Tailwind CSS. It features:

- Landing page that showcases the board UI and quick actions for each mode.
- Real-time game room page with Socket.IO synchronization and endgame summaries.
- Leaderboard view backed by the backend API.

Start the development server:

```bash
yarn install
yarn dev:frontend
```

By default the app connects to the backend at `http://localhost:3001`. Override with `NEXT_PUBLIC_BACKEND_URL`.

## Dictionary data

A trimmed dictionary (`backend/src/assets/dictionary/words_alpha.txt`) is bundled for development. In production set the `DICTIONARY_PATH` environment variable to a full American English word list to enable comprehensive validation.

## Prisma schema

The project includes an initial Prisma schema (`backend/prisma/schema.prisma`) outlining persistence for users, games, moves, and leaderboard stats. Run `npx prisma generate` inside the backend package after configuring `DATABASE_URL`.

## Testing

- **Backend**: Jest (configure tests under `backend/src/**/*.spec.ts`).
- **Frontend**: Add Playwright tests under `frontend/tests` to validate multiplayer flows.

## Roadmap

- Implement persistent storage using PostgreSQL + Prisma migrations.
- Add comprehensive unit tests for the scoring engine and AI heuristics.
- Build lobby management, invitations, and chat for online rooms.
- Expand dictionary handling with incremental updates and caching.
