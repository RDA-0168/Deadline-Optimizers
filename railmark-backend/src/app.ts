// =============================================================================
// RailMark AI — Express Application Setup
// =============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ENV } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: ENV.CORS_ORIGIN === '*' ? true : ENV.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Mount API Gateway
app.use('/api', apiRouter);

// Serve static public assets if present
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
