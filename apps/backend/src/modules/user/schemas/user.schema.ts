import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from '../enums';
import { DEFAULT_LOCALE } from '../constants/user.constants';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  passwordHash?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: DEFAULT_LOCALE })
  locale: string;

  @Prop()
  timezone?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes (email index is automatically created by unique: true)
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });
