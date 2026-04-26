import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado o inválido');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      // Inject user data into request to forward it to microservices if needed
      req['user'] = decoded;
      req.headers['x-user-id'] = decoded.sub;
      req.headers['x-user-email'] = decoded.email;
      req.headers['x-user-roles'] = JSON.stringify(decoded.roles);
      next();
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
