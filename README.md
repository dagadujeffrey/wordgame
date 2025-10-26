# WordGrid

WordGrid is a turn-based multiplayer word strategy game designed for 4×4 tactical battles. This repository contains a full-stack TypeScript implementation with a NestJS backend and a Next.js frontend. The project supports local hot-seat play, online multiplayer powered by WebSockets, and solo matches against adaptive AI opponents.

## 1. Before you start (install the basics)

If you have never set up a development environment, follow these steps in order. Everything below works on Windows, macOS, or any modern Linux distribution.

1. **Create a GitHub account (optional but helpful).** Go to <https://github.com> and sign up. You can still download the project without an account, but GitHub makes it easier to keep the files up to date.
2. **Install Git.**
   - **Windows**: Download the official installer from <https://git-scm.com/downloads>. During installation keep the defaults. After it finishes you will have "Git Bash"—a terminal app you can use for the remaining steps.
   - **macOS**: Open the Terminal app and run `xcode-select --install`, or install the Git package from <https://git-scm.com/downloads>.
   - **Linux**: Use your package manager (for example `sudo apt install git` on Ubuntu/Debian or `sudo dnf install git` on Fedora).
3. **Install Node.js (the JavaScript runtime).**
   - Go to <https://nodejs.org> and download the “LTS” installer for your system, then run it and accept the defaults.
   - After installation, open a terminal and run `node --version`. You should see a version number (18.x or newer works great).
4. **Enable Yarn (the package manager we use).**
   - Starting with Node 16.10+, Yarn is available via the built-in **corepack** tool. In your terminal run:

     ```bash
     corepack enable
     ```

   - If the command says "corepack: command not found," close and reopen the terminal and try again. As a fallback you can install Yarn globally with `npm install --global yarn`.

You only need to complete these steps once per computer.

## 2. Get the project files

Choose whichever option feels easier:

- **Clone with Git (recommended, keeps the folder connected to GitHub):**

  ```bash
  git clone https://github.com/<your-org-or-username>/wordgame.git
  cd wordgame
  ```

- **Download a ZIP archive:** Visit the repository page on GitHub, click the green **Code** button, choose **Download ZIP**, unzip it somewhere easy to find, and open that folder in your terminal or file explorer.

Once you are inside the `wordgame` folder, you are ready for the setup commands.

## 3. Install the project dependencies

Run the following command once. It downloads all packages for both the backend and the frontend:

```bash
yarn install
```

The first run can take a few minutes. You will see a `node_modules` folder appear inside `backend/` and `frontend/` when it finishes.

## 4. Start the backend (game server)

1. Open a terminal in the `wordgame` folder.
2. Run:

   ```bash
   yarn dev:backend
   ```

3. Keep this terminal window open. The server runs at <http://localhost:3001>. If you close the window the server stops.

### What the backend does

- Provides the REST API and WebSocket connections for multiplayer games.
- Handles authentication, scoring, AI moves, and leaderboard calculations.

## 5. Start the frontend (web interface)

1. Open **another** terminal window (leave the backend running in the first one).
2. Move into the project folder if you are not already there:

   ```bash
   cd path/to/wordgame
   ```

3. Start the web app:

   ```bash
   yarn dev:frontend
   ```

4. Visit <http://localhost:3000> in your browser. You should see the WordGrid interface. It will communicate with the backend you started earlier.

To stop the app or server, return to the respective terminal and press `Ctrl + C` (hold the Control key and tap the letter C).

## 6. Optional: Configure environment variables

Most features work out of the box. If you want to customize anything, create a `.env` file in the project root or inside the `backend/` and `frontend/` folders. Common settings include:

- `DATABASE_URL` for connecting the backend to a PostgreSQL database (required if you run Prisma migrations).
- `NEXT_PUBLIC_BACKEND_URL` to point the frontend at a different backend URL.
- `DICTIONARY_PATH` to provide an alternative dictionary file.

## 7. Optional: Generate Prisma client

If you are planning to use the database features, run these commands after setting `DATABASE_URL`:

```bash
cd backend
npx prisma generate
```

This builds TypeScript helpers for accessing the database.

## 8. Run tests (when you add them)

This project is ready for automated testing, but no sample tests are included yet. When you create your own suites, run them with:

- **Backend unit tests (Jest):**

  ```bash
  yarn test:backend
  ```

- **Frontend end-to-end tests (Playwright):**

  ```bash
  yarn test:frontend
  ```

If those commands fail because the scripts are not defined yet, add the desired scripts to the root `package.json` first.

## 9. Project layout (reference)

```
wordgame/
├── backend/   # NestJS API, WebSocket gateway, AI, and scoring logic
├── frontend/  # Next.js + Tailwind web client
└── package.json  # Yarn workspaces entry point
```

## 10. Key backend modules

- **Authentication**: Register/login endpoints with Argon2 password hashing and JWT token issuance.
- **Games**: In-memory room management, move validation, and endgame scoring using a 4×4 grid engine.
- **Dictionary service**: Lazy loads a local 2–4 letter dictionary with graceful fallbacks.
- **AI**: Configurable heuristics for easy, medium, and hard CPU opponents.
- **Leaderboard**: Aggregates player performance metrics.

## 11. Key frontend features

- Landing page that showcases the board UI and quick actions for each mode.
- Real-time game room page with Socket.IO synchronization and endgame summaries.
- Leaderboard view backed by the backend API.

## 12. Dictionary data

A trimmed dictionary (`backend/src/assets/dictionary/words_alpha.txt`) is bundled for development. In production set the `DICTIONARY_PATH` environment variable to a full American English word list to enable comprehensive validation.

## 13. Roadmap

- Implement persistent storage using PostgreSQL + Prisma migrations.
- Add comprehensive unit tests for the scoring engine and AI heuristics.
- Build lobby management, invitations, and chat for online rooms.
- Expand dictionary handling with incremental updates and caching.
