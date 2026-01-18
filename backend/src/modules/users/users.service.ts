import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { User } from '../../entities/user.entity';
import { User as UserType, UserRole } from '@fledge/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['employee'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'department', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['employee'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'department', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['employee'],
    });
  }

  async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    department?: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password using SHA-256
    const hashedPassword = createHash('sha256').update(userData.password).digest('hex');

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'employee',
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateData: Partial<{
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department: string;
    isActive: boolean;
  }>): Promise<User> {
    const user = await this.findOne(id);

    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = createHash('sha256').update(newPassword).digest('hex');

    await this.userRepository.update(id, {
      password: hashedPassword,
    });
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['employee'],
    });

    if (!user) {
      return null;
    }

    const hashedPassword = createHash('sha256').update(password).digest('hex');
    console.log('hashedPassword', hashedPassword);
    if (hashedPassword !== user.password) {
      return null;
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      relations: ['employee'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'department', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt']
    });
  }

  async getAdmins(): Promise<User[]> {
    return this.findByRole('admin');
  }

  async getEmployees(): Promise<User[]> {
    return this.findByRole('employee');
  }
}
