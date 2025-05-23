import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import express from 'express';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

const expressApp = express();
let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    // Enable CORS
    app.enableCors();
    // Swagger setup
    const config = new DocumentBuilder()
    .setTitle('PPS Project')
    .setDescription('PPS API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Add route for swagger.json
  app.getHttpAdapter().get('/swagger-json', (req, res) => res.json(document));

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://swagger.io/favicon-32x32.png',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
    swaggerOptions: {
      urls: [
        {
          url: '/swagger-json',
          name: 'OpenAPI Spec',
        },
      ],
      persistAuthorization: true,
    },
  });
  await app.init();
  }
  return app;
}
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3334;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger documentation available at http://localhost:${port}/api`);
    });
  });
}
// Serverless handler for Vercel
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
}
 
 
