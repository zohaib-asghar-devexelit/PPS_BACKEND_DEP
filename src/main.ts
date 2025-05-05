// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';


const server = express();

let appInitialized: boolean = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
  appInitialized = true;
}

export default async function handler(req: any, res: any) {
  if (!appInitialized) {
    await bootstrap();
  }
  return server(req, res);
}
