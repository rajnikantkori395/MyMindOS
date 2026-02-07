import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'] },
        content: String,
        timestamp: Date,
      },
    ],
    default: [],
  })
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
  }>;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop()
  deletedAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
ChatSchema.index({ userId: 1, createdAt: -1 });
