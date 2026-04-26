import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GatewayAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    const userId = request.headers['x-user-id'];
    const userEmail = request.headers['x-user-email'];
    const userRolesRaw = request.headers['x-user-roles'];

    if (!userId) {
      throw new UnauthorizedException('No autorizado por API Gateway');
    }

    let roles = [];
    if (userRolesRaw) {
      try {
        roles = JSON.parse(userRolesRaw as string);
      } catch (e) {
        roles = [];
      }
    }

    request['user'] = {
      sub: userId,
      email: userEmail,
      roles,
    };

    return true;
  }
}
