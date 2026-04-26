import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '../../../libs/common/src';
import { AuthMiddleware } from './middleware/auth.middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';

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
          ttl: 60, // 60 seconds
          limit: 100, // 100 requests per TTL
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Proteger las rutas de usuarios con AuthMiddleware
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/users/*', method: RequestMethod.ALL });

    // Auth Service Proxy (Rutas públicas y privadas mezcladas, el auth-service se encarga de sus guards si es necesario, 
    // pero el Gateway no bloquea /auth/login ni /auth/register)
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${this.configService.get<number>('AUTH_SERVICE_PORT', 3001)}`,
          changeOrigin: true,
          pathRewrite: { '^/api/auth': '/auth' },
        }),
      )
      .forRoutes({ path: 'api/auth/*', method: RequestMethod.ALL });

    // User Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${this.configService.get<number>('USER_SERVICE_PORT', 3002)}`,
          changeOrigin: true,
          pathRewrite: { '^/api/users': '/users' },
        }),
      )
      .forRoutes({ path: 'api/users/*', method: RequestMethod.ALL });
  }
}
