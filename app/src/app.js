'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const healthRouter = require('./infrastructure/http/routes/health.routes');
const authRouter = require('./infrastructure/http/routes/auth.routes');
const userRouter = require('./infrastructure/http/routes/user.routes');
const errorHandler = require('./infrastructure/http/middleware/errorHandler');
const notFound = require('./infrastructure/http/middleware/notFound');

const app = express();

// ── Security & utility middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// ── Error handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
