import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { SessionRepository } from './repositories/session.repository';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Session, SessionDocument } from './schemas/session.schema';
import { JwtPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    private readonly sessionRepo: SessionRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto, deviceInfo: string) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await new this.userModel({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: 'user',
    }).save();

    const tokens = await this.createSession(user._id as Types.ObjectId, user.email, user.role, deviceInfo);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto, deviceInfo: string) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.createSession(user._id as Types.ObjectId, user.email, user.role, deviceInfo);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionRepo.deleteById(sessionId);
  }

  async refreshTokens(refreshToken: string, deviceInfo: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionRepo.findByToken(refreshToken);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newPayload: JwtPayload = {
      sub: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
      sessionId: (session._id as Types.ObjectId).toString(),
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn,
    });

    await this.sessionRepo.updateToken(
      (session._id as Types.ObjectId).toString(),
      newRefreshToken,
      expiresAt,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async getSessions(userId: string) {
    return this.sessionRepo.findAllByUserId(userId);
  }

  private async createSession(
    userId: Types.ObjectId,
    email: string,
    role: string,
    deviceInfo: string,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tempPayload = { sub: userId.toString(), email, role, sessionId: '' };

    const tempSession = await this.sessionRepo.create({
      userId,
      token: 'temp',
      deviceInfo,
      expiresAt,
    });

    const sessionId = (tempSession._id as Types.ObjectId).toString();
    const payload: JwtPayload = { ...tempPayload, sessionId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    await this.sessionRepo.updateToken(sessionId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: UserDocument) {
    return {
      id: (user._id as Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: (user as UserDocument & { createdAt: Date }).createdAt?.toISOString(),
    };
  }
}
