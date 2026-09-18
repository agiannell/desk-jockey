# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `nvm use` — this project pins Node 16 (`.nvmrc`); the CI pipeline also targets Node 16.
- `yarn` — install dependencies.
- `yarn start` — run the CRA frontend dev server (port 3000).
- `yarn start:dev-server` — run the Express/Socket.io backend via `nodemon` (watches `server/`, entry point is `server/index.js`). Alternative: `node server/index.js` if nodemon isn't available.
- Both the frontend and backend need to be running simultaneously for the app to function locally.
- `yarn build` — production build of the frontend (outputs to `build/`, which the Express server serves statically in production).
- `yarn test` — run the CRA/Jest test suite in watch mode; pass a pattern to target one file/test, e.g. `yarn test App`. There is no separate lint script — linting is handled by `react-scripts` (`eslintConfig` in `package.json` extends `react-app`).

## Architecture

This is a single repo containing both halves of the app — a Create React App frontend (`src/`) and an Express + Socket.io backend (`server/`) — plus raw SQL query files (`db/`).

**Dev vs. production topology.** In dev, the CRA dev server (3000) proxies unmatched requests to the Express server (4004) via the `proxy` field in `package.json` — but this proxy only covers fetch/XHR calls, not full-page browser navigations. In production, Express serves the built frontend directly (`express.static` on `build/`), so frontend and backend share one origin. This is why relative API calls (`axios.get('/api/...')`, `/pizza`) work everywhere, while things that require a real page navigation or a value baked in at build time (the Spotify login link, the OAuth redirect target, the Socket.io connection URL) go through `REACT_APP_BASE_URL` / `CALLBACK_BASE_URL` env vars instead — these must be set correctly for the environment the frontend is built/served in.

**Database access via massive.js — no ORM/model layer.** SQL lives entirely in `.sql` files under `db/<schema>/<name>.sql` (e.g. `db/rooms/get_public_rooms.sql`, `db/users/check_user.sql`). `massive` reads this directory tree at boot and auto-generates `db.<schema>.<name>()` methods from it — there's no query builder or model code to look for; to change a query, edit the `.sql` file directly. The connected instance is attached once via `app.set('db', db)` in `server/index.js` and retrieved per-request in controllers as `req.app.get('db')`.

**Auth is two separate concerns.** (1) Spotify OAuth (Authorization Code flow, handled in `spotifyController.js`): `/login` redirects to Spotify's authorize endpoint, `/callback` exchanges the code for an access token that's stored server-side in the Express session (`req.session.token`) — not persisted to the DB. The frontend calls `/pizza` on load to pull that token out of the session into Redux. (2) App-level user identity (`userController.js`, `users` table): a separate profile record (display name, email, profile pic) looked up/created via `/api/check-user` and `/api/user`, independent of the Spotify token.

**Real-time state is in-memory, not persisted.** `socketController.js` tracks room membership and each room's playback queue in plain JS arrays scoped to the server process — this resets on every server restart and isn't backed by the DB. Socket.io events (`join-room`, `queue`, `message`, `request`/`sync` for playback sync) are all keyed by `roomId`.

**Frontend state.** Redux (`src/ducks/`) is intentionally minimal — a single `userReducer` holding the Spotify access token, the app user, and the "local user" profile. Everything else is component-local `useState`.
