-- User Management Service — initial schema migration
-- Run once against the target PostgreSQL database.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  name          VARCHAR(255)  NOT NULL DEFAULT '',
  is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
  otp_code      VARCHAR(10),
  otp_expires_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
