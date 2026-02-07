import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileStatus, FileType } from '../enums';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop()
  checksum?: string;

  @Prop({ required: true, index: true })
  storageKey: string;

  @Prop({ required: true, enum: ['s3', 'minio', 'local'], default: 'minio' })
  storageProvider: 's3' | 'minio' | 'local';

  @Prop()
  url?: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ type: String, enum: FileType, required: true })
  type: FileType;

  @Prop({ type: String, enum: FileStatus, default: FileStatus.UPLOADING })
  status: FileStatus;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({
    type: {
      text: String,
      metadata: Object,
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
      },
      error: String,
      processedAt: Date,
    },
    default: {},
  })
  extractionResult: {
    text?: string;
    metadata?: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
    processedAt?: Date;
  };

  @Prop()
  processedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);

// Indexes
FileSchema.index({ userId: 1, status: 1 });
FileSchema.index({ userId: 1, type: 1 });
FileSchema.index({ storageKey: 1 });
FileSchema.index({ createdAt: -1 });
