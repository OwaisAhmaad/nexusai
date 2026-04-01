import { Session, SessionDocument } from '../schemas/session.schema';
import { Types } from 'mongoose';

export interface ISessionRepository {
  create(data: {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    expiresAt: Date;
  }): Promise<SessionDocument>;
  findByToken(token: string): Promise<SessionDocument | null>;
  findById(id: string): Promise<SessionDocument | null>;
  findAllByUserId(userId: string): Promise<SessionDocument[]>;
  deleteById(id: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
  updateToken(id: string, newToken: string, expiresAt: Date): Promise<SessionDocument | null>;
}

export const SESSION_REPOSITORY = 'SESSION_REPOSITORY';
