import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from '../schemas/session.schema';
import { ISessionRepository } from '../interfaces/session.repository.interface';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async create(data: {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    expiresAt: Date;
  }): Promise<SessionDocument> {
    const session = new this.sessionModel(data);
    return session.save();
  }

  async findByToken(token: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ token, isActive: true }).exec();
  }

  async findById(id: string): Promise<SessionDocument | null> {
    return this.sessionModel.findById(id).exec();
  }

  async findAllByUserId(userId: string): Promise<SessionDocument[]> {
    return this.sessionModel
      .find({ userId: new Types.ObjectId(userId), isActive: true })
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.sessionModel.findByIdAndDelete(id).exec();
  }

  async deleteByToken(token: string): Promise<void> {
    await this.sessionModel.findOneAndDelete({ token }).exec();
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.sessionModel
      .deleteMany({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async updateToken(
    id: string,
    newToken: string,
    expiresAt: Date,
  ): Promise<SessionDocument | null> {
    return this.sessionModel
      .findByIdAndUpdate(id, { token: newToken, expiresAt }, { new: true })
      .exec();
  }
}
