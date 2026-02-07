import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, unique: true, index: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  deviceInfo?: string;

  @Prop()
  ipAddress?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// TTL index for automatic cleanup of expired sessions
// Note: expiresAt already has index: true, so we update it with TTL
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
