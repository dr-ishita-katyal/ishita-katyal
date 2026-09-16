import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import ApiError from './utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
mongoose.set('bufferTimeoutMS', 2000);

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
          },
        }
      : false,
  })
);

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Same-origin requests and server-to-server calls arrive without an Origin header.
      if (!origin || origins.includes(origin)) return cb(null, true);
      // A clean 403 rather than an unhandled error and a stack trace.
      cb(new ApiError(403, 'This origin is not allowed to call the API.'));
    },
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(hpp());
if (!isProd) app.use(morgan('dev'));

app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) =>
  res.json({ ok: true, uptime: process.uptime(), db: mongoose.connection.readyState === 1 })
);

app.use('/api', apiRoutes);

// In production the built client is served from the same origin.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (isProd) {
  app.use(express.static(clientDist, { maxAge: '30d', index: false }));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use('/api', notFound);
app.use(errorHandler);

export default app;
