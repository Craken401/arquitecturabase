## Quick context for AI coding agents

This repository is a small Node/Express teaching app (server + static client) used in the "Procesos" course.
Key facts an agent needs to be immediately productive:

- Entry point: `index.js` — creates an Express `app`, mounts static files and the REST routes, and exports `{ app, PORT }` for tests.
- In-memory domain: `servidor/modelo.js` defines `Sistema` (users store) and `Usuario`. State is kept in `this.usuarios` and NOT persisted.
- Client REST wrapper: `cliente/clienteRest.js` exposes methods (`agregarUsuario`, `obtenerUsuarios`, `usuarioActivo`, `numeroUsuarios`, `eliminarUsuario`) and expects jQuery present in the page.
- Tests: `spec/apiSpec.js` use `supertest` + `jasmine`. Tests clear Node require cache before each test run to get a fresh `Sistema` (see how `cargarAplicacion()` deletes `require.cache`).

## REST contract and conventions (copy these exactly)
- All endpoints are GET and always return JSON with HTTP 200 (errors are signalled in-body):
  - `GET /agregarUsuario/:nick` → `{ "nick": "alice" }` on success or `{ "nick": -1 }` on failure.
  - `GET /obtenerUsuarios` → map/dictionary of users, e.g. `{ "alice": {"nick":"alice"} }`.
  - `GET /usuarioActivo/:nick` → `{ "nick": "alice", "activo": true|false }`.
  - `GET /numeroUsuarios` → `{ "num": 3 }`.
  - `GET /eliminarUsuario/:nick` → `{ "nick": "alice" }` or `{ "nick": -1 }`.

Note: use the `-1` sentinel exactly for failure cases to remain compatible with existing client and tests.

## Common development workflows (commands)
Use PowerShell (project README recommends Node 18+):

```powershell
npm install
npm start        # runs node index.js (server on PORT env or 3000)
npm test         # runs jasmine config at spec/support/jasmine.json (API tests)
npm run testW    # Windows alternative in package.json
```

For client-side specs (manual): open `pruebas-arquitecturabase/SpecRunner.html` in a browser.

## Patterns & gotchas an agent should follow when changing code
- When modifying `Sistema` state or adding endpoints that change state, ensure tests still reset state — tests rely on clearing `require.cache` (see `spec/apiSpec.js`). If adding module-level singletons, update tests accordingly.
- Keep response shapes minimal and JSON-only. Do not change success/failure sentinel semantics (e.g., returning HTTP 4xx instead of `{nick:-1}` will break existing client/tests).
- Client code (`cliente/controlWeb.js` + `cliente/clienteRest.js`) expects the server to serve static files from repository root and `cliente/index.html` at `/` (index.js reads and serves this file). When changing paths, update `index.js` accordingly.
- `ClienteRest` uses jQuery and returns Promises that resolve to the JSON body (or rejects with Error). Preserve the function names and return shapes if you want the frontend to keep working.

## Where to change things
- Business logic: edit `servidor/modelo.js` (add/adjust operations on `Sistema`).
- Routes / HTTP layer: edit `index.js` to register or change route handlers; keep handlers returning the same JSON shapes.
- Frontend behavior: edit `cliente/controlWeb.js` and `cliente/clienteRest.js` (remember jQuery dependency).
- Tests: add/update specs under `spec/` (API) or `pruebas-arquitecturabase/spec/` (browser-run client specs). Keep using `supertest` for API integration tests.

## Helpful examples to reference
- Resetting test state: `spec/apiSpec.js` — `delete require.cache[modeloPath]; delete require.cache[servidorPath];` then `require(servidorPath)`.
- Minimal successful add-user flow: `request(app).get('/agregarUsuario/alice')` → expect `body.nick === 'alice'` (see `spec/apiSpec.js`).

## When to ask the maintainer
- If you plan to change the API to use HTTP error codes or alter response shapes (remove `-1` sentinel), ask before modifying — the client and tests assume the current contract.
- If you add persistent storage (DB), update tests and provide a reproducible local dev/test strategy (in-memory fallback or test DB docker compose).

If anything here is unclear or you want me to expand a section (examples, more file references, or add quickfix PRs), tell me which part to iterate on.
