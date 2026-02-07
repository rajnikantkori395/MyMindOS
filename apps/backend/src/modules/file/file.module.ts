import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from './repositories/file.repository';
import { StorageService } from './services/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService, FileRepository, StorageService],
  exports: [FileService, FileRepository, MongooseModule],
})
export class FileModule {}
