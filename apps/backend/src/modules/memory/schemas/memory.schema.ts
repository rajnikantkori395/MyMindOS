import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MemoryType, MemoryStatus } from '../enums';

@Schema({ timestamps: true })
export class Memory extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: MemoryType, required: true, index: true })
  type: MemoryType;

  @Prop({
    type: String,
    enum: MemoryStatus,
    default: MemoryStatus.DRAFT,
    index: true,
  })
  status: MemoryStatus;

  @Prop({
    type: {
      type: String,
      id: String,
      url: String,
    },
  })
  source?: {
    type: string;
    id: string;
    url?: string;
  };

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({
    type: {
      vectorId: String,
      model: String,
      dimensions: Number,
      generatedAt: Date,
    },
  })
  embedding?: {
    vectorId?: string;
    model?: string;
    dimensions?: number;
    generatedAt?: Date;
  };

  @Prop({
    type: {
      summary: String,
      keyPoints: [String],
      tags: [String],
      category: String,
      relatedConcepts: [String],
      generatedAt: Date,
    },
  })
  insight?: {
    summary?: string;
    keyPoints?: string[];
    tags?: string[];
    category?: string;
    relatedConcepts?: string[];
    generatedAt?: Date;
  };

  @Prop({
    type: [
      {
        targetMemoryId: { type: String, ref: 'Memory' },
        relationship: {
          type: String,
          enum: ['related', 'parent', 'child', 'reference', 'similar'],
        },
        strength: Number,
        createdAt: Date,
      },
    ],
    default: [],
  })
  links: Array<{
    targetMemoryId: string;
    relationship: 'related' | 'parent' | 'child' | 'reference' | 'similar';
    strength?: number;
    createdAt?: Date;
  }>;

  @Prop()
  processedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const MemorySchema = SchemaFactory.createForClass(Memory);

// Indexes
MemorySchema.index({ userId: 1, status: 1 });
MemorySchema.index({ userId: 1, type: 1 });
MemorySchema.index({ userId: 1, tags: 1 });
MemorySchema.index({ userId: 1, 'source.type': 1, 'source.id': 1 });
MemorySchema.index({ title: 'text', content: 'text' }); // Text search index
MemorySchema.index({ createdAt: -1 });
