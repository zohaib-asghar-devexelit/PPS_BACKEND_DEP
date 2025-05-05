import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const server = express();
let cachedApp: ReturnType<typeof NestFactory.create> | null = null;

// Shared bootstrap for both local + Vercel
async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();
    cachedApp = Promise.resolve(app);
  }
  return cachedApp;
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3002;
    app.getHttpAdapter().getInstance().listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  });
}

// Vercel serverless handler
export const handler = async (req: Request, res: Response) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res); // Let Express handle the request
};

export default handler;
