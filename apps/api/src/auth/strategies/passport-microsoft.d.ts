declare module 'passport-microsoft' {
  import { Strategy as PassportStrategy } from 'passport';
  export interface MicrosoftProfile {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
    _json: { mail?: string; userPrincipalName?: string };
  }
  export interface MicrosoftStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
    tenant?: string;
  }
  export class Strategy extends PassportStrategy {
    constructor(
      options: MicrosoftStrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: MicrosoftProfile,
        done: (err: any, user?: any) => void,
      ) => void,
    );
  }
}
