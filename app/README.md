# User Management Service

A production-ready **Node.js / Express.js** microservice that handles user registration, authentication, OTP verification, account management, and account deletion. Built with **hexagonal architecture** (ports & adapters) and backed by **PostgreSQL**.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Running Tests](#running-tests)
- [Docker](#docker)
- [Project Structure](#project-structure)

---

## Features

- ✅ User registration with OTP email verification
- ✅ JWT-based authentication
- ✅ OTP verification flow
- ✅ Profile retrieval and update
- ✅ Account deletion
- ✅ Health check endpoint
- ✅ Hexagonal architecture (domain / application / infrastructure layers)

---

## Architecture

```
src/
├── domain/               # Core business logic — no framework dependencies
│   ├── entities/         # User entity
│   └── ports/            # Interfaces (IUserRepository, ITokenService, …)
├── application/
│   └── use-cases/        # One file per use-case
├── infrastructure/
│   ├── auth/             # JWT & bcrypt adapters
│   ├── database/         # PostgreSQL pool, migrations, repository adapter
│   ├── http/             # Express routes, controllers, middleware
│   ├── logger/           # Structured logger
│   └── otp/              # OTP generation & delivery adapter
├── container.js          # Dependency injection wiring
├── app.js                # Express application factory
└── index.js              # Entry point
```

---

## Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Runtime      | Node.js 20 LTS              |
| Framework    | Express.js 4                |
| Auth         | JSON Web Token (jsonwebtoken) |
| Password     | bcryptjs                    |
| Database     | PostgreSQL (via `pg`)       |
| Validation   | express-validator           |
| Testing      | Jest + Supertest            |
| Container    | Docker (multi-stage build)  |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 14

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd user-management-service

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# 4. Run the database migration
psql -U postgres -d user_management -f src/infrastructure/database/migrations/001_create_users.sql

# 5. Start the service
npm run dev
```

---

## Environment Variables

| Variable           | Default                        | Description                          |
|--------------------|--------------------------------|--------------------------------------|
| `PORT`             | `3000`                         | HTTP port                            |
| `NODE_ENV`         | `development`                  | Runtime environment                  |
| `DB_HOST`          | `localhost`                    | PostgreSQL host                      |
| `DB_PORT`          | `5432`                         | PostgreSQL port                      |
| `DB_NAME`          | `user_management`              | Database name                        |
| `DB_USER`          | `postgres`                     | Database user                        |
| `DB_PASSWORD`      | *(empty)*                      | Database password                    |
| `DB_POOL_MAX`      | `10`                           | Max pool connections                 |
| `JWT_SECRET`       | `change_me_in_production`      | **Must be changed in production**    |
| `JWT_EXPIRES_IN`   | `1h`                           | Token expiry (e.g. `1h`, `7d`)       |
| `BCRYPT_SALT_ROUNDS` | `10`                         | bcrypt cost factor                   |
| `LOG_LEVEL`        | `info`                         | `info` or `debug`                    |

---

## API Reference

### Health

| Method | Path      | Auth | Description        |
|--------|-----------|------|--------------------|
| GET    | `/health` | —    | Liveness check     |

**Response**
```json
{ "status": "ok", "service": "user-management-service", "timestamp": "…" }
```

---

### Auth

| Method | Path                       | Auth | Description              |
|--------|----------------------------|------|--------------------------|
| POST   | `/api/v1/auth/register`    | —    | Register a new user      |
| POST   | `/api/v1/auth/login`       | —    | Login and receive JWT    |
| POST   | `/api/v1/auth/verify-otp`  | —    | Verify OTP               |

#### POST `/api/v1/auth/register`
```json
{ "email": "alice@example.com", "password": "secret123", "name": "Alice" }
```

#### POST `/api/v1/auth/login`
```json
{ "email": "alice@example.com", "password": "secret123" }
```
Returns `{ "token": "<jwt>", "user": { … } }`.

#### POST `/api/v1/auth/verify-otp`
```json
{ "email": "alice@example.com", "otp": "123456" }
```

---

### Users (requires `Authorization: Bearer <token>`)

| Method | Path               | Auth | Description          |
|--------|--------------------|------|----------------------|
| GET    | `/api/v1/users/me` | JWT  | Get own profile      |
| PATCH  | `/api/v1/users/me` | JWT  | Update own profile   |
| DELETE | `/api/v1/users/me` | JWT  | Delete own account   |

---

## Running Tests

```bash
# All tests
npm test

# With coverage report
npm run test:coverage
```

---

## Docker

```bash
# Build image
docker build -t user-management-service .

# Run container (requires a running PostgreSQL instance)
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=postgres \
  -e JWT_SECRET=supersecret \
  user-management-service
```

Or use Docker Compose (example `docker-compose.yml` not included — add one for local development).

---

## Project Structure

```
.
├── src/
│   ├── domain/
│   │   ├── entities/User.js
│   │   └── ports/
│   │       ├── IUserRepository.js
│   │       ├── ITokenService.js
│   │       ├── IHashService.js
│   │       └── IOtpService.js
│   ├── application/
│   │   └── use-cases/
│   │       ├── RegisterUserUseCase.js
│   │       ├── LoginUserUseCase.js
│   │       ├── VerifyOtpUseCase.js
│   │       ├── GetUserProfileUseCase.js
│   │       ├── UpdateUserProfileUseCase.js
│   │       └── DeleteUserUseCase.js
│   ├── infrastructure/
│   │   ├── auth/
│   │   │   ├── JwtTokenService.js
│   │   │   └── BcryptHashService.js
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   ├── migrations/001_create_users.sql
│   │   │   └── repositories/PostgresUserRepository.js
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── user.controller.js
│   │   │   ├── middleware/
│   │   │   │   ├── authenticate.js
│   │   │   │   ├── errorHandler.js
│   │   │   │   ├── notFound.js
│   │   │   │   └── validate.js
│   │   │   └── routes/
│   │   │       ├── auth.routes.js
│   │   │       ├── health.routes.js
│   │   │       └── user.routes.js
│   │   ├── logger/index.js
│   │   └── otp/SimpleOtpService.js
│   ├── container.js
│   ├── app.js
│   └── index.js
├── tests/
│   ├── health.test.js
│   └── unit/
│       ├── user.entity.test.js
│       ├── use-cases.test.js
│       └── adapters.test.js
├── .dockerignore
├── .env.example
├── Dockerfile
├── package.json
└── README.md
```

---

## License

MIT
