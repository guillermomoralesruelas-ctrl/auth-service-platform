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
import { Resend } from 'resend';

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
  ) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = resendApiKey ? new Resend(resendApiKey) : new Resend('re_dummy_key');
  }

  private resend: Resend;

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

  async forgotPassword(email: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist for security reasons
      return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.' };
    }

    const resetToken = uuidv4();
    // 15 minutes = 900 seconds
    await this.redisService.set(`reset_token:${resetToken}`, user.id, 900);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await this.resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>',
        to: user.email,
        subject: 'Recuperación de Contraseña - Portfolio',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a14; color: white; padding: 40px; border-radius: 10px;">
            <h1 style="color: white; margin-bottom: 20px;">Recuperación de Contraseña</h1>
            <p style="color: #a1a1aa; line-height: 1.6;">Hola ${user.firstName || 'Usuario'},</p>
            <p style="color: #a1a1aa; line-height: 1.6;">Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva:</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #8b5cf6, #22d3ee); color: white; font-weight: 600; text-decoration: none; border-radius: 8px;">Restablecer Contraseña</a>
            </div>
            <p style="color: #a1a1aa; font-size: 12px; margin-top: 30px;">Este enlace expirará en 15 minutos.</p>
            <p style="color: #a1a1aa; font-size: 12px;">Si no fuiste tú, puedes ignorar este correo de forma segura.</p>
          </div>
        `,
      });
      console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
    } catch (error) {
      console.error('Error sending email:', error);
      console.log(`[DEV] (Email failed) Password reset link for ${email}: ${resetLink}`);
    }

    return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const userId = await this.redisService.get(`reset_token:${token}`);
    if (!userId) {
      throw new UnauthorizedException('El token de recuperación es inválido o ha expirado.');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);

    // Invalidate token
    await this.redisService.del(`reset_token:${token}`);

    return { message: 'Tu contraseña ha sido actualizada exitosamente.' };
  }
}
