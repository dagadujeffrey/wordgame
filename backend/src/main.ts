import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(json({ limit: '2mb' }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`WordGrid backend listening on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap backend', error);
  process.exit(1);
});
