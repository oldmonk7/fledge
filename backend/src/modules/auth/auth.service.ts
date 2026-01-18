import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '@fledge/shared';
import { AccessToken } from '../../entities/access-token.entity';

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
    // Create the user
    const user = await this.usersService.create({
      email: signupDto.email,
      password: signupDto.password,
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      role: 'employee',
    });

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
      message: 'Signup successful',
    };
  }

  async logout(): Promise<{ message: string }> {
    // For session-based auth, this would handle session cleanup
    // For now, just return success
    return { message: 'Logout successful' };
  }
}