import { Controller, Get, Delete, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { GatewayAuthGuard, RolesGuard, Roles } from '../../../../libs/common/src';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(GatewayAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  findMe(@Req() req) {
    return this.usersService.findMe(req.user.sub);
  }

  @Put('me')
  @ApiOperation({ summary: 'Actualizar perfil del usuario actual' })
  updateMe(@Req() req, @Body() updateData: { firstName?: string, lastName?: string }) {
    return this.usersService.updateProfile(req.user.sub, updateData);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo Admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener un usuario por ID (Solo Admin)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar un usuario (Solo Admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Put(':id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Asignar un rol a un usuario (Solo Admin)' })
  assignRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.assignRole(id, role);
  }
}
