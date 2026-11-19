import 'dotenv/config';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';

import { AppModule } from './app.module';
import { AppException } from './common/errors/app.exception';
import { ErrorCode } from './common/errors/error-code';
import {
  isProduction,
  validateProductionObjectStorage,
} from './config/object-storage.config';

async function bootstrap() {
  validateProductionObjectStorage();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.useBodyParser('json', { limit: '20mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '20mb' });

  if (!isProduction()) {
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
  }

  const productionOrigins = [
    'https://cestasmart.com',
    'https://www.cestasmart.com',
  ];

  const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) {
      return true;
    }

    if (productionOrigins.includes(origin)) {
      return true;
    }

    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  };

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () =>
        new AppException(
          ErrorCode.VALIDATION_ERROR,
          'Validation failed',
          HttpStatus.BAD_REQUEST,
        ),
    }),
  );

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`CestaSmart API running on http://localhost:${port}`);
}

bootstrap();
