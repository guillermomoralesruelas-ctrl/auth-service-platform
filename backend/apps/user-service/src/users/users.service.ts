import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../../../../libs/database/src';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findMe(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(id: string, updateData: { firstName?: string, lastName?: string }): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    if (updateData.firstName !== undefined) user.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) user.lastName = updateData.lastName;
    
    await this.usersRepository.save(user);
    
    const { passwordHash, ...result } = user;
    return result;
  }

  async findAll(): Promise<any[]> {
    const users = await this.usersRepository.find({ relations: ['roles'] });
    return users.map(user => {
      const { passwordHash, ...result } = user;
      return result;
    });
  }

  async findOne(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.usersRepository.remove(user);
  }

  async assignRole(userId: string, roleName: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const role = await this.rolesRepository.findOne({ where: { name: roleName.toUpperCase() } });
    if (!role) throw new NotFoundException('Rol no encontrado');

    const hasRole = user.roles.some(r => r.id === role.id);
    if (!hasRole) {
      user.roles.push(role);
      await this.usersRepository.save(user);
    }

    return this.findOne(userId);
  }
}
