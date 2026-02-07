import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../schemas/session.schema';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: Model<Session>,
  ) {}

  async create(session: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
  }): Promise<Session> {
    const newSession = new this.sessionModel(session);
    return newSession.save();
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return this.sessionModel.findOne({ refreshToken }).exec();
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.sessionModel.deleteOne({ refreshToken }).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.sessionModel.deleteMany({ userId }).exec();
  }

  async deleteExpired(): Promise<number> {
    const result = await this.sessionModel
      .deleteMany({ expiresAt: { $lt: new Date() } })
      .exec();
    return result.deletedCount || 0;
  }
}
