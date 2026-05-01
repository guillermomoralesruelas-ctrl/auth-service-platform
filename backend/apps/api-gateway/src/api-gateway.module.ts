import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '../../../libs/common/src';
import { AuthMiddleware } from './middleware/auth.middleware';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 60,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class ApiGatewayModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Proteger las rutas de usuarios con AuthMiddleware
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/users/*', method: RequestMethod.ALL });

    // Auth Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: this.configService.get<string>('AUTH_SERVICE_URL') || `http://localhost:${this.configService.get<number>('AUTH_SERVICE_PORT', 3001)}`,
          changeOrigin: true,
          pathRewrite: { '^/api/auth': '/auth' },
          onProxyReq: fixRequestBody,
        }),
      )
      .forRoutes({ path: 'api/auth/*', method: RequestMethod.ALL });

    // User Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: this.configService.get<string>('USER_SERVICE_URL') || `http://localhost:${this.configService.get<number>('USER_SERVICE_PORT', 3002)}`,
          changeOrigin: true,
          pathRewrite: { '^/api/users': '/users' },
          onProxyReq: fixRequestBody,
        }),
      )
      .forRoutes({ path: 'api/users/*', method: RequestMethod.ALL });
  }
}
