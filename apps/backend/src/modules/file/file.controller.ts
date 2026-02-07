import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import {
  UploadFileDto,
  PresignedUrlDto,
  FileResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/schemas/user.schema';
import { FileType, FileStatus } from './enums';
import { PAGINATION_DEFAULTS } from './constants/file.constants';
import { LoggerService } from '../../common/logger/logger.service';

@ApiTags('Files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly logger: LoggerService,
  ) {}

  @Post('presigned-url')
  @ApiOperation({
    summary: 'Generate presigned URL for file upload',
    description:
      'Generates a presigned URL that allows direct upload to S3/MinIO storage',
  })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        uploadUrl: { type: 'string', example: 'https://...' },
        fileId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        expiresIn: { type: 'number', example: 3600 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generatePresignedUrl(
    @Body() presignedUrlDto: PresignedUrlDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log('Presigned URL request', 'FileController', {
      userId: user.id,
      filename: presignedUrlDto.filename,
    });

    return this.fileService.generatePresignedUrl(
      user.id,
      presignedUrlDto.filename,
      presignedUrlDto.mimeType,
      presignedUrlDto.size,
      presignedUrlDto.type,
      presignedUrlDto.expiresIn,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload file directly',
    description: 'Uploads a file directly via multipart/form-data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: Object.values(FileType),
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type?: FileType,
    @CurrentUser() user?: User,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.logger.log('File upload request', 'FileController', {
      userId: user.id,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

    return this.fileService.uploadFile(user.id, file, type);
  }

  @Post(':id/complete')
  @ApiOperation({
    summary: 'Mark file upload as complete',
    description:
      'Marks a file as uploaded after using presigned URL. Call this after uploading to the presigned URL.',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File marked as uploaded',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markUploadComplete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.fileService.markFileAsUploaded(id, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all files',
    description: 'Returns paginated list of user files',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: FileType,
    description: 'Filter by file type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: FileStatus,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in filename',
  })
  @ApiResponse({
    status: 200,
    description: 'Files retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/FileResponseDto' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        totalPages: { type: 'number', example: 5 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllFiles(
    @Query('page', new DefaultValuePipe(PAGINATION_DEFAULTS.PAGE), ParseIntPipe)
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(PAGINATION_DEFAULTS.LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Query('type') type?: FileType,
    @Query('status') status?: FileStatus,
    @Query('search') search?: string,
    @CurrentUser() user?: User,
  ) {
    if (!user) {
      throw new Error('User not found');
    }

    const filters: any = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (search) filters.search = search;

    return this.fileService.findAll(user.id, filters, { page, limit });
  }

  @Get('storage/usage')
  @ApiOperation({
    summary: 'Get storage usage',
    description: 'Returns storage usage statistics for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Storage usage retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalBytes: { type: 'number', example: 104857600 },
        totalFiles: { type: 'number', example: 25 },
        limitBytes: { type: 'number', example: 10737418240 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStorageUsage(@CurrentUser() user: User) {
    return this.fileService.getStorageUsage(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get file by ID',
    description: 'Returns file metadata and download URL',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getFileById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.fileService.findById(id, user.id);
  }

  @Get(':id/download')
  @ApiOperation({
    summary: 'Get download URL',
    description: 'Returns a presigned download URL for the file',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({
    status: 200,
    description: 'Download URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://...' },
        expiresIn: { type: 'number', example: 3600 },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDownloadUrl(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    const url = await this.fileService.getDownloadUrl(id, user.id);
    return { url, expiresIn: 3600 };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete file',
    description: 'Soft deletes a file (marks as deleted, removes from storage)',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteFile(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    await this.fileService.delete(id, user.id);
    return { message: 'File deleted successfully' };
  }
}
