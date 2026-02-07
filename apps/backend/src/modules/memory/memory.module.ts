import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Memory, MemorySchema } from './schemas/memory.schema';
import { MemoryService } from './memory.service';
import { MemoryController } from './memory.controller';
import { MemoryRepository } from './repositories/memory.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
  ],
  controllers: [MemoryController],
  providers: [MemoryService, MemoryRepository],
  exports: [MemoryService, MemoryRepository, MongooseModule],
})
export class MemoryModule {}
