# Contention portal

## Production prerequisites

- Node.js 20, 22, or 24 and npm
- A reachable MongoDB deployment
- `MONGO_URI` and a cryptographically random `JWT_SECRET` of at least 32 bytes
- A host that supports long-lived WebSocket connections

Allow the production host's outbound IP in the MongoDB network policy, require
TLS in the MongoDB connection string, and keep the database credentials and JWT
secret in the hosting platform's secret store. Login tokens expire after 12
hours by default; override this with `JWT_EXPIRES_IN` if needed.

The production frontend uses same-origin `/api` and `/` Socket.IO URLs. Set
`CORS_ORIGIN` only when serving the frontend from a different origin.

## Build and run

```bash
cp .env.example .env
# Replace the example values in .env before continuing.
npm ci
npm run build
NODE_ENV=production npm start
```

For a managed deployment platform, use:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/healthz`

The application must run as one process because Express and Socket.IO share the
same HTTP server. If it is scaled horizontally, add sticky sessions and a shared
Socket.IO adapter first.
