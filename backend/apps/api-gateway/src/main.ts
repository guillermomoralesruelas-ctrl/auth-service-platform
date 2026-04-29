import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import helmet from 'helmet';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Security headers
  app.use(helmet());

  // Request logging (auditoría)
  app.use(morgan('combined'));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3003',
    credentials: true,
  });

  const port = process.env.PORT || process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API Gateway running on port ${port}`);
}
bootstrap();
