import { Callback, Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let cachedServer;

const bootstrapServer = async () => {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);

    const config = new DocumentBuilder()
      .setTitle('Company Auth API')
      .setDescription('API for registering and authenticating companies')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
};

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
