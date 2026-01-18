import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService, LoginDto, SignupDto, AuthResponse } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const context = {
      ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
      userAgent: req.headers['user-agent'] || null,
    };

    const authResponse = await this.authService.login(loginDto, context);

    // Set Authorization header with Bearer token
    res.setHeader('Authorization', `Bearer ${authResponse.accessToken}`);

    return authResponse;
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupDto: SignupDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const context = {
      ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
      userAgent: req.headers['user-agent'] || null,
    };

    const authResponse = await this.authService.signup(signupDto, context);
    console.log('Signup response:', authResponse);
    // Set Authorization header with Bearer token
    res.setHeader('Authorization', `Bearer ${authResponse.accessToken}`);

    return authResponse;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ message: string }> {
    return this.authService.logout();
  }
}