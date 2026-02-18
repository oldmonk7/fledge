import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allowed CORS origins: FRONTEND_URL (comma-separated) + localhost + Railway frontends.
  const frontendUrls = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim()).filter(Boolean)
    : [];
  const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    ...frontendUrls,
  ]);
  const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return false;
    if (allowedOrigins.has(origin)) return true;
    if (/^https?:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin)) return true;
    return false;
  };

  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();

  // Handle OPTIONS preflight immediately; only set Allow-Origin when origin is allowed.
  instance.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin as string | undefined;
      if (origin && isAllowedOrigin(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.status(204).end();
    }
    next();
  });

  // CORS for non-OPTIONS requests (same allowlist).
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, false);
      if (isAllowedOrigin(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  app.setGlobalPrefix('api');

  // Request log (defensive so it never breaks the request).
  app.use((req: Request, _res: Response, next: NextFunction) => {
    try {
      const host = req.get?.('host') ?? req.hostname ?? '-';
      const origin = req.get?.('origin') ?? '-';
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} host=${host} origin=${origin}`);
    } catch (_) {
      /* no-op */
    }
    next();
  });

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on port ${port}`);
}
bootstrap();
