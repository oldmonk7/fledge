import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from '@fledge/shared';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('role') role?: UserRole): Promise<User[]> {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @Get('admins')
  async getAdmins(): Promise<User[]> {
    return this.usersService.getAdmins();
  }

  @Get('employees')
  async getEmployees(): Promise<User[]> {
    return this.usersService.getEmployees();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    department?: string;
  }): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      department: string;
      isActive: boolean;
    }>
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string }
  ): Promise<void> {
    return this.usersService.changePassword(id, body.newPassword);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
