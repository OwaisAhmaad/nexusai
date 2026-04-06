import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET', ''),
      callbackURL: `${configService.get('OAUTH_CALLBACK_BASE', 'http://localhost:3001')}/api/v1/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) {
    const user = await this.authService.findOrCreateOAuthUser({
      provider: 'github',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? `${profile.username}@github.local`,
      name: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value,
    });
    done(null, user);
  }
}
