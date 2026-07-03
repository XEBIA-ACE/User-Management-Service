# AGENTS.md — User Management Service

## 1. Stack

| Technology | Role |
|---|---|
| **Node.js 20 LTS** | Runtime environment |
| **Express.js 4.x** | HTTP server and routing framework |
| **PostgreSQL 16** | Primary relational data store |
| **pg / node-postgres** | PostgreSQL client for Node.js |
| **jsonwebtoken** | JWT signing and verification |
| **bcryptjs** | Password hashing |
| **speakeasy / otplib** | OTP generation and verification |
| **nodemailer** | OTP delivery via email |
| **zod** | Request schema validation |
| **dotenv** | Environment variable loading |
| **winston** | Structured logging |
| **helmet** | HTTP security headers |
| **express-rate-limit** | Rate limiting on auth endpoints |
| **Jest** | Unit and integration test runner |
| **supertest** | HTTP integration testing against Express |
| **node-pg-migrate** | Database migration management |
| **ESLint + Prettier** | Code style enforcement |

---

## 2. Project Structure

```
user-management-service/
├── src/
│   ├── config/
│   │   ├── db.js                  # pg Pool initialisation and export
│   │   ├── env.js                 # Validated env vars via zod (throws on bad config)
│   │   └── logger.js              # Winston logger instance
│   ├── controllers/
│   │   ├── auth.controller.js     # register, login, logout handlers
│   │   ├── otp.controller.js      # sendOtp, verifyOtp handlers
│   │   └── account.controller.js  # getProfile, updateProfile, deleteAccount handlers
│   ├── middlewares/
│   │   ├── authenticate.js        # JWT verification middleware
│   │   ├── validate.js            # Zod schema validation middleware factory
│   │   ├── rateLimiter.js         # express-rate-limit configurations
│   │   └── errorHandler.js        # Centralised error-handling middleware
│   ├── models/
│   │   ├── user.model.js          # SQL queries for users table (CRUD)
│   │   └── otp.model.js           # SQL queries for otp_tokens table
│   ├── routes/
│   │   ├── index.js               # Mounts all routers under /api/v1
│   │   ├── auth.routes.js         # POST /register, POST /login, POST /logout
│   │   ├── otp.routes.js          # POST /otp/send, POST /otp/verify
│   │   └── account.routes.js      # GET /account, PUT /account, DELETE /account
│   ├── schemas/
│   │   ├── auth.schema.js         # Zod schemas for register and login payloads
│   │   ├── otp.schema.js          # Zod schema for OTP payloads
│   │   └── account.schema.js      # Zod schema for account update payload
│   ├── services/
│   │   ├── auth.service.js        # Business logic: hashing, token issuance
│   │   ├── otp.service.js         # OTP generation, storage, expiry, verification
│   │   └── account.service.js     # Profile fetch, update, soft/hard delete logic
│   ├── utils/
│   │   ├── jwt.js                 # signToken, verifyToken helpers
│   │   ├── hash.js                # hashPassword, comparePassword helpers
│   │   └── errors.js              # AppError class and HTTP error factories
│   └── app.js                     # Express app setup (no listen call)
├── migrations/
│   ├── 001_create_users.sql       # users table DDL
│   └── 002_create_otp_tokens.sql  # otp_tokens table DDL
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.js
│   │   │   ├── otp.service.test.js
│   │   │   └── account.service.test.js
│   │   └── utils/
│   │       ├── jwt.test.js
│   │       └── hash.test.js
│   ├── integration/
│   │   ├── auth.routes.test.js
│   │   ├── otp.routes.test.js
│   │   └── account.routes.test.js
│   └── helpers/
│       ├── db.helper.js           # Test DB setup/teardown utilities
│       └── fixtures.js            # Reusable test data factories
├── .env.example                   # All required env keys with placeholder values
├── .eslintrc.js                   # ESLint config (airbnb-base + prettier)
├── .prettierrc                    # Prettier config
├── .gitignore
├── docker-compose.yml             # App + PostgreSQL services
├── Dockerfile
├── jest.config.js
├── package.json
├── tasks.md                       # Created by agent before implementation begins
└── AGENTS.md                      # This file
```

---

## 3. Required Workflow

The agent **must** follow these steps in order. Do not skip or reorder steps.

### Step 1 — Read and Understand Specifications
- Read all story-level spec documents provided in the repository or prompt context.
- Identify every endpoint, data model, business rule, and acceptance criterion.
- Flag any ambiguity as a comment in `tasks.md` before proceeding.

### Step 2 — Create `tasks.md`
- Create `tasks.md` at the project root **before writing any source code**.
- Break work into atomic tasks, each tagged with a type: `[SETUP]`, `[MODEL]`, `[SERVICE]`, `[ROUTE]`, `[TEST]`, `[CONFIG]`.
- Example entry:
  ```
  - [ ] [MODEL] Create user.model.js with findByEmail, createUser, deleteUser functions
  - [ ] [SERVICE] Implement auth.service.js: registerUser hashes password, stores user, returns JWT
  ```
- Check off tasks (`[x]`) as they are completed.

### Step 3 — Environment and Configuration
- Copy `.env.example` to `.env` (never commit `.env`).
- Implement `src/config/env.js` first — all other modules must import from it.
- Required env vars to define in `.env.example`:
  ```
  NODE_ENV=development
  PORT=3000
  DATABASE_URL=postgres://user:password@localhost:5432/user_mgmt
  JWT_SECRET=changeme
  JWT_EXPIRES_IN=15m
  JWT_REFRESH_SECRET=changeme_refresh
  JWT_REFRESH_EXPIRES_IN=7d
  OTP_EXPIRY_SECONDS=300
  SMTP_HOST=
  SMTP_PORT=587
  SMTP_USER=
  SMTP_PASS=
  BCRYPT_SALT_ROUNDS=12
  ```

### Step 4 — Database Migrations
- Write raw SQL migration files in `migrations/` (numbered, sequential).
- `001_create_users.sql` must include: `id` (UUID default gen_random_uuid()), `email` (unique, not null), `password_hash`, `is_verified` (boolean default false), `created_at`, `updated_at`, `deleted_at` (nullable for soft delete).
- `002_create_otp_tokens.sql` must include: `id`, `user_id` (FK → users), `token_hash`, `expires_at`, `used` (boolean), `created_at`.
- Run migrations via `node-pg-migrate` — add `npm run migrate` script to `package.json`.

### Step 5 — Implement in Dependency Order
Implement files strictly in this order to avoid circular dependencies:

1. `src/utils/errors.js`
2. `src/utils/hash.js`
3. `src/utils/jwt.js`
4. `src/config/db.js`
5. `src/models/user.model.js`
6. `src/models/otp.model.js`
7. `src/services/auth.service.js`
8. `src/services/otp.service.js`
9. `src/services/account.service.js`
10. `src/schemas/*.js` (all schemas)
11. `src/middlewares/*.js` (all middlewares)
12. `src/controllers/*.js` (all controllers)
13. `src/routes/*.js` (all routes)
14. `src/app.js`
15. `src/server.js` (entry point — calls `app.listen`)

### Step 6 — Write Tests
- Write unit tests for every service and utility function before marking any task complete.
- Write integration tests for every route using `supertest` against a test database.
- Tests must pass `npm test` with no failures before proceeding to Step 7.

### Step 7 — Validate
- Run `npm run lint` — zero errors permitted.
- Run `npm test -- --coverage` — coverage must be ≥ 90% for all metrics (statements, branches, functions, lines).
- Run `docker compose up --build` and confirm the service starts and `/api/v1/health` returns `200 OK`.
- Check off all tasks in `tasks.md`.

---

## 4. Coding Conventions

### Naming
- **Files:** `kebab-case` for all files (e.g., `auth.service.js`, `otp.routes.js`).
- **Variables/functions:** `camelCase`.
- **Classes:** `PascalCase` (e.g., `AppError`).
- **Constants:** `SCREAMING_SNAKE_CASE` for true constants (e.g., `JWT_ALGORITHM`).
- **Database columns:** `snake_case` in SQL; map to `camelCase` in model layer.

### Architecture Patterns
- **Strict layering:** Routes → Controllers → Services → Models. Controllers must not contain business logic. Models must not contain business logic — only parameterised SQL queries.
- **No raw SQL outside models.** All database interaction lives in `src/models/`.
- **Services are framework-agnostic.** Services must not import Express, `req`, or `res`.
- **Dependency injection for DB:** Pass the `pg` pool into model functions or use a module-level singleton — do not instantiate connections inside service functions.
- **Async/await everywhere.** No callback-style code. All async errors must be caught and forwarded to `next(err)`.

### Error Handling
- Define `AppError` in `src/utils/errors.js` extending the native `Error` class with `statusCode` and `isOperational` properties.
- All controllers must wrap logic in `try/catch` and call `next(error)`.
- The `errorHandler` middleware must distinguish operational errors (return JSON) from programmer errors (log and return 500).

### Security
- Passwords must be hashed with `bcryptjs` using `BCRYPT_SALT_ROUNDS` from env — never store plaintext.
- OTP values must be hashed before storage in the database.
- JWTs must use `HS256` algorithm minimum; store only `userId` and `email` in payload.
- All auth endpoints must be behind `rateLimiter` middleware.
- Apply `helmet()` globally in `app.js`.
- Validate all request bodies through Zod schemas via the `validate` middleware before reaching controllers.

### Style
- Prettier enforced: 2-space indent, single quotes, trailing commas (ES5), 100-char line width.
- ESLint: `eslint-config-airbnb-base` + `eslint-plugin-prettier`.
- No `console.log` in source code — use the Winston logger exclusively.

---

## 5. Testing

### Setup
- Use **Jest 29** as the test runner.
- Use **supertest** for HTTP-layer integration tests.
- Set `NODE_ENV=test` during all test runs.
- Integration tests connect to a dedicated test database (`user_mgmt_test`); configure via `DATABASE_URL_TEST` env var.

### `jest.config.js`
```js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThresholds: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterFramework: ['./tests/helpers/db.helper.js'],
};
```

### Unit Tests (`tests/unit/`)
- Mock all external dependencies (database, email, JWT) using `jest.mock()`.
- Each service function must have tests for: happy path, invalid input, and error propagation.
- Each utility function must have tests for: expected output, edge cases, and thrown errors.
- Example structure for `auth.service.test.js`:
  ```js
  describe('AuthService.registerUser', () => {
    it('should hash the password before storing', async () => { ... });
    it('should throw AppError if email already exists', async () => { ... });
    it('should return a signed JWT on success', async () => { ... });
  });
  ```

### Integration Tests (`tests/integration/`)
- Use `supertest(app)` — import `app.js`, not `server.js`.
- Run migrations against the test DB in `beforeAll`; truncate tables in `beforeEach`; drop schema in `afterAll`.
- Test every route for: `2xx` success, `4xx` validation failure, `4xx` auth failure, and `5xx` simulated error.
- Do **not** mock the database in integration tests — use the real test DB.

### Running Tests
```bash
npm test                        # Run all tests
npm test -- --coverage          # Run with coverage report
npm test -- --testPathPattern=unit   # Unit tests only
npm test -- --testPathPattern=integration  # Integration tests only
```

### `package.json` Scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "NODE_ENV=test jest --forceExit --detectOpenHandles",
    "lint": "eslint src/ tests/",
    "lint:fix": "eslint src/ tests/ --fix",
    "migrate": "node-pg-migrate up",
    "migrate:test": "DATABASE_URL=$DATABASE_URL_TEST node-pg-migrate up"
  }
}
```

---

## 6. Docker & CI

### `Dockerfile`
```dockerfile
# ── Build stage ──────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Production stage ─────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/health || exit 1

CMD ["node", "src/server.js"]
```

### `docker-compose.yml`
```yaml
version: '3.9'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://pguser:pgpass@db:5432/user_mgmt
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: pguser
      POSTGRES_PASSWORD: pgpass
      POSTGRES_DB: user_mgmt
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pguser