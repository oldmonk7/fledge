import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '@fledge/shared';
import { AccessToken } from '../../entities/access-token.entity';
import { Employee } from '../../entities/employee.entity';
import { FSAAccount } from '../../entities/fsa-account.entity';
import { User as UserEntity } from '../../entities/user.entity';

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(FSAAccount)
    private readonly fsaAccountRepository: Repository<FSAAccount>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async login(
    loginDto: LoginDto,
    context?: { ipAddress?: string | null; userAgent?: string | null },
  ): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Validate user credentials
    const user = await this.usersService.validatePassword(email, password);

    if (!user) {
      console.error('Invalid email or password');
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Please contact your administrator.');
    }

    // Update last login timestamp
    await this.usersService.updateLastLogin(user.id);

    // Create new access token
    const accessTokenValue = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const accessToken = this.accessTokenRepository.create({
      token: accessTokenValue,
      user,
      ipAddress: context?.ipAddress ?? null,
      userAgent: context?.userAgent ?? null,
      expiresAt,
    });

    await this.accessTokenRepository.save(accessToken);

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken: accessTokenValue,
      message: 'Login successful',
    };
  }

  async signup(
    signupDto: SignupDto,
    context?: { ipAddress?: string | null; userAgent?: string | null },
  ): Promise<AuthResponse> {
    // Use a transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the user
      const user = await this.usersService.create({
        email: signupDto.email,
        password: signupDto.password,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        role: 'employee',
      });

      // Generate unique employee ID
      const employeeId = `EMP-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
      
      // Create employee record
      const employee = this.employeeRepository.create({
        userId: user.id,
        user,
        employeeId,
        hireDate: new Date(),
      });
      await queryRunner.manager.save(Employee, employee);

      // Calculate plan year dates (current calendar year)
      const now = new Date();
      const currentYear = now.getFullYear();
      const planYearStart = new Date(currentYear, 0, 1); // January 1st
      const planYearEnd = new Date(currentYear, 11, 31); // December 31st

      // Create FSA account with default annual limit of $5000
      const fsaAccount = this.fsaAccountRepository.create({
        employeeId: employee.id,
        accountType: 'DCFSA',
        annualLimit: 5000,
        currentBalance: 0,
        usedAmount: 0,
        planYearStart,
        planYearEnd,
        status: 'active',
      });
      await queryRunner.manager.save(FSAAccount, fsaAccount);

      // Update last login timestamp
      await this.usersService.updateLastLogin(user.id);

      // Create new access token
      const accessTokenValue = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

      const accessToken = this.accessTokenRepository.create({
        token: accessTokenValue,
        user,
        ipAddress: context?.ipAddress ?? null,
        userAgent: context?.userAgent ?? null,
        expiresAt,
      });

      await queryRunner.manager.save(AccessToken, accessToken);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Reload user with employee and FSA account relations
      const userWithRelations = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['employee', 'employee.fsaAccounts'],
      });

      if (!userWithRelations) {
        throw new Error('Failed to load user after signup');
      }

      // Return user data (excluding password) and token
      const { password: _, ...userWithoutPassword } = userWithRelations;
      return {
        user: userWithoutPassword,
        accessToken: accessTokenValue,
        message: 'Signup successful',
      };
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async logout(): Promise<{ message: string }> {
    // For session-based auth, this would handle session cleanup
    // For now, just return success
    return { message: 'Logout successful' };
  }
}