import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import helmet from 'helmet';
import morgan from 'morgan';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, { bodyParser: false });

  // Security headers - Disable CSP for Swagger to work properly in some environments
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  // Request logging
  app.use(morgan('combined'));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Auth Service - Unified API Gateway')
    .setDescription('Unified interface for Auth, User, and Identity services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API Gateway running on port ${port}`);
}
bootstrap();
