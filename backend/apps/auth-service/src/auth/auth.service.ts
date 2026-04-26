import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../../../../libs/database/src';
import { RedisService } from '../../../../libs/common/src';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const existingUser = await this.usersRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    
    // Find or create default USER role
    let userRole = await this.rolesRepository.findOne({ where: { name: 'USER' } });
    if (!userRole) {
      userRole = this.rolesRepository.create({ name: 'USER' });
      await this.rolesRepository.save(userRole);
    }

    const user = this.usersRepository.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      roles: [userRole],
    });

    await this.usersRepository.save(user);

    return {
      message: 'Usuario registrado exitosamente',
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { email: loginDto.email },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, roles: user.roles.map(r => r.name) };
    
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuidv4();
    
    // Save refresh token in Redis (7 days expiration)
    // 7 days = 60 * 60 * 24 * 7 = 604800 seconds
    await this.redisService.set(`refresh_token:${user.id}`, refreshToken, 604800);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: string, incomingRefreshToken: string): Promise<any> {
    const storedToken = await this.redisService.get(`refresh_token:${userId}`);
    
    if (!storedToken || storedToken !== incomingRefreshToken) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Generate new tokens
    const payload = { sub: user.id, email: user.email, roles: user.roles.map(r => r.name) };
    
    const accessToken = this.jwtService.sign(payload);

    const newRefreshToken = uuidv4();
    await this.redisService.set(`refresh_token:${user.id}`, newRefreshToken, 604800);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    // Delete refresh token
    await this.redisService.del(`refresh_token:${userId}`);
  }

  async googleLogin(req: any): Promise<any> {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    let user = await this.usersRepository.findOne({ 
      where: { email: req.user.email },
      relations: ['roles']
    });

    if (!user) {
      // Find or create default USER role
      let userRole = await this.rolesRepository.findOne({ where: { name: 'USER' } });
      if (!userRole) {
        userRole = this.rolesRepository.create({ name: 'USER' });
        await this.rolesRepository.save(userRole);
      }

      user = this.usersRepository.create({
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        googleId: req.user.googleId,
        passwordHash: '', // No password for OAuth
        roles: [userRole],
      });
      await this.usersRepository.save(user);
    } else if (!user.googleId) {
      user.googleId = req.user.googleId;
      await this.usersRepository.save(user);
    }

    const payload = { sub: user.id, email: user.email, roles: user.roles.map(r => r.name) };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();
    await this.redisService.set(`refresh_token:${user.id}`, refreshToken, 604800);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
