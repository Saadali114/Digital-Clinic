import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiV1Router } from './routes/index.js';

export const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing with explicit origin allowlist and credentials
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing & Cookie middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global session authentication extractor
app.use(authenticate);

// Mount versioned REST API
app.use('/api/v1', apiV1Router);

// 404 fallback for unrecognized routes
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource or endpoint does not exist on this server.',
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
