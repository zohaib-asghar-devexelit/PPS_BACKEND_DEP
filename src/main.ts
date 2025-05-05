import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { Server } from 'http';

const expressApp = express();

let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const config = new DocumentBuilder()
    .setTitle('Company Auth API')
    .setDescription('API for registering and authenticating companies')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}
