import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('Microservicio de gestión de usuarios y roles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.USER_SERVICE_PORT || 3002;
  await app.listen(port);
  console.log(`User Service running on http://localhost:${port}`);
}
bootstrap();
