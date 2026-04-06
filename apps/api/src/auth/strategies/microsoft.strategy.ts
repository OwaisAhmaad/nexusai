import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, MicrosoftProfile } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID', ''),
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET', ''),
      callbackURL: `${configService.get('OAUTH_CALLBACK_BASE', 'http://localhost:3001')}/api/v1/auth/microsoft/callback`,
      scope: ['user.read'],
      tenant: configService.get<string>('MICROSOFT_TENANT_ID', 'common'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftProfile,
    done: (err: any, user?: any) => void,
  ) {
    const email =
      profile.emails?.[0]?.value ??
      profile._json?.mail ??
      profile._json?.userPrincipalName ??
      `${profile.id}@microsoft.local`;
    const user = await this.authService.findOrCreateOAuthUser({
      provider: 'microsoft',
      providerId: profile.id,
      email,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    });
    done(null, user);
  }
}
