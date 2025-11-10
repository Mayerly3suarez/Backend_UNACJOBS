# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install deps: `npm install`
- Run in dev (auto-restart): `npm run dev`
- Start (prod): `npm start`
- Run all tests: `npm test`
- Run a single test by file/name:
  - `npx jest path/to/test.spec.js`
  - `npx jest path/to/test.spec.js -t "test name"`
  - Watch mode: `npx jest --watch`

## Required environment

Create a `.env` with these keys (values not included here):
- Supabase: `SUPABASE_URL`, `SUPABASE_KEY`
- Server: `PORT` (optional)
- Auth: `JWT_SECRET`
- Email (nodemailer): `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
- Microsoft Graph / SharePoint: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `SHAREPOINT_SITE_ID`, `SHAREPOINT_DRIVE_ID`

Diagnostic endpoints provided by `server.js` (useful for setup):
- `GET /api/test-connection` — checks Supabase connectivity
- `GET /api/tables` — lists tables (via RPC fallback)

## Architecture overview

Node.js + Express API with Supabase as the data layer and optional integrations for SharePoint uploads and email.

- Entry points
  - `server.js`: loads env, wires diagnostic routes, starts HTTP server.
  - `app.js`: builds the Express app, global middleware, mounts API routes.

- Routing
  - Documents: `src/routes/documentRoutes.js` mounted at `/api/documents`.
    - Controllers: `src/controllers/documentscontroller.js`
    - Endpoints: `POST /` (create), `GET /` (list by user), `DELETE /:id` (delete)
    - Middleware: JWT auth (`src/middlewares/authMiddleware.js`) and role-based guard (`src/middlewares/roleMiddleware.js`).
  - Contracts: `src/routes/contractRoutes.js` → controllers in `src/controllers/contractController.js`.
  - Users: `src/routes/userRoutes.js` → controllers in `src/controllers/usercontroller.js`.
  - Note: Only Documents routes are mounted in `app.js` by default. If you need Users/Contracts, mount them, for example:
    - `app.use('/api/users', require('./src/routes/userRoutes'))`
    - `app.use('/api/contracts', require('./src/routes/contractRoutes'))`

- Data layer
  - Supabase client and helpers in `src/config/db.js` export: `supabase`, `testConnection()`, `listTables()`.
  - Controllers operate directly on tables: `Usuarios`, `Documentos`, `Contratos`.
  - The `src/models/*.js` files are lightweight table/field maps (not active ORMs) and are currently not referenced by controllers.
  - Dependencies `sequelize`, `pg`, `pg-hstore` exist but are not used in the current Supabase-based implementation.

- Auth & roles
  - `src/middlewares/authMiddleware.js`: verifies JWT from `Authorization: Bearer <token>` using `JWT_SECRET`; attaches `{ id, rol }` to `req.user`.
  - `src/middlewares/roleMiddleware.js`: enforces role membership (e.g., `admin`, `docente`, `candidato`).

- Integrations
  - SharePoint upload via Microsoft Graph: `src/services/sharepointService.js` (requires Azure and SharePoint env vars above). Exposes `uploadFile(buffer, fileName)`.
  - Email via Nodemailer: `src/utils/sendEmail.js` using SMTP config from env.

## Notes and caveats

- Users controller currently imports `../config/supabaseClient`; the actual export is in `src/config/db.js` as `supabase`. Update the import to avoid runtime errors.
- Two documents controllers exist (`documentscontroller.js` and `documentsController.js`) with the same exports; the routes import the lowercase filename.
- Consider mounting Users and Contracts routes in `app.js` if those endpoints are expected to be reachable.
- No linter is configured in `package.json`.
- Jest and Supertest are in `devDependencies`, but no tests are present yet.
