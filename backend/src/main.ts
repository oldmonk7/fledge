import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import type { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, _res, next) => {
    const host = req.get('host') ?? req.hostname ?? '-';
    const origin = req.get('origin') ?? '-';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} host=${host} origin=${origin}`);
    next();
  });

  app.setGlobalPrefix('api');

  // CORS: allow frontend origin(s). With credentials we must echo back the request origin (no '*').
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
  const isAllowedOrigin = (origin: string) => {
    if (allowedOrigins.has(origin)) return true;
    // Allow Railway frontend subdomains (e.g. https://something.up.railway.app).
    if (/^https?:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin)) return true;
    return false;
  };
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
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
