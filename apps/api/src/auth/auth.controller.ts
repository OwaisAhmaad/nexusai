import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('api/v1/auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceInfo = req.headers['user-agent'] || 'Unknown';
    const result = await this.authService.register(dto, deviceInfo);
    this.setRefreshCookie(res, result.refreshToken);
    return { data: { accessToken: result.accessToken, user: result.user } };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceInfo = req.headers['user-agent'] || 'Unknown';
    const result = await this.authService.login(dto, deviceInfo);
    this.setRefreshCookie(res, result.refreshToken);
    return { data: { accessToken: result.accessToken, user: result.user } };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sessionId);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'] as string | undefined;
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: 'No refresh token provided',
      });
    }
    const deviceInfo = req.headers['user-agent'] || 'Unknown';
    const result = await this.authService.refreshTokens(refreshToken, deviceInfo);
    this.setRefreshCookie(res, result.refreshToken);
    return { data: { accessToken: result.accessToken, user: result.user } };
  }

  @Get('sessions')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Active sessions' })
  async getSessions(@CurrentUser() user: JwtPayload) {
    const sessions = await this.authService.getSessions(user.sub);
    return { data: sessions };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  googleAuth() {
    // Passport redirects to Google — no body needed
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({ status: 302, description: 'Google OAuth callback — redirects to frontend' })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const token = await this.authService.generateTokenForUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google`);
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiResponse({ status: 302, description: 'Redirects to GitHub OAuth' })
  githubAuth() {
    // Passport redirects to GitHub — no body needed
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiResponse({ status: 302, description: 'GitHub OAuth callback — redirects to frontend' })
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const token = await this.authService.generateTokenForUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=github`);
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
