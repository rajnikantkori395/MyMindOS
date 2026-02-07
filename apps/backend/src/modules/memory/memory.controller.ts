import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MemoryService } from './memory.service';
import {
  CreateMemoryDto,
  UpdateMemoryDto,
  SearchMemoryDto,
  HybridSearchMemoryDto,
  MemoryResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/schemas/user.schema';
import { MemoryType, MemoryStatus } from './enums';
import { PAGINATION_DEFAULTS } from './constants/memory.constants';
import { LoggerService } from '../../common/logger/logger.service';

@ApiTags('Memories')
@Controller('memories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MemoryController {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new memory',
    description: 'Creates a new memory record with title, content, and metadata',
  })
  @ApiResponse({
    status: 201,
    description: 'Memory created successfully',
    type: MemoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createMemoryDto: CreateMemoryDto,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.create(user.id, createMemoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all memories',
    description: 'Returns paginated list of user memories with optional filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: MemoryType,
    description: 'Filter by memory type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MemoryStatus,
    description: 'Filter by memory status',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Filter by tags (comma-separated)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Text search in title and content',
  })
  @ApiResponse({
    status: 200,
    description: 'Memories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/MemoryResponseDto' },
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
  async getAllMemories(
    @Query('page', new DefaultValuePipe(PAGINATION_DEFAULTS.PAGE), ParseIntPipe)
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(PAGINATION_DEFAULTS.LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Query('type') type?: MemoryType,
    @Query('status') status?: MemoryStatus,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
    @CurrentUser() user?: User,
  ) {
    if (!user) {
      throw new Error('User not found');
    }

    const filters: any = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (tags) filters.tags = tags.split(',').map((t) => t.trim());
    if (search) filters.search = search;

    return this.memoryService.findAll(user.id, filters, { page, limit });
  }

  @Post('search')
  @ApiOperation({
    summary: 'Text search memories',
    description: 'Performs text search in memory titles and content',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: [MemoryResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async search(
    @Body() searchDto: SearchMemoryDto,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.textSearch(
      user.id,
      searchDto.query,
      searchDto.limit,
      {
        type: searchDto.type,
        status: searchDto.status,
        tags: searchDto.tags,
      },
    );
  }

  @Post('search/semantic')
  @ApiOperation({
    summary: 'Semantic search memories',
    description:
      'Performs semantic/vector search (requires AI Engine integration)',
  })
  @ApiResponse({
    status: 200,
    description: 'Semantic search results',
    type: [MemoryResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async semanticSearch(
    @Body() searchDto: SearchMemoryDto,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.semanticSearch(user.id, {
      query: searchDto.query,
      limit: searchDto.limit,
      similarityThreshold: searchDto.similarityThreshold,
      filters: {
        type: searchDto.type,
        status: searchDto.status,
        tags: searchDto.tags,
      },
    });
  }

  @Post('search/hybrid')
  @ApiOperation({
    summary: 'Hybrid search memories',
    description:
      'Performs hybrid search combining keyword and semantic search (requires AI Engine integration)',
  })
  @ApiResponse({
    status: 200,
    description: 'Hybrid search results',
    type: [MemoryResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async hybridSearch(
    @Body() searchDto: HybridSearchMemoryDto,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.hybridSearch(user.id, {
      query: searchDto.query,
      limit: searchDto.limit,
      similarityThreshold: searchDto.similarityThreshold,
      keywordWeight: searchDto.keywordWeight,
      semanticWeight: searchDto.semanticWeight,
      filters: {
        type: searchDto.type,
        status: searchDto.status,
        tags: searchDto.tags,
      },
    });
  }

  @Get('tags')
  @ApiOperation({
    summary: 'Get memories by tags',
    description: 'Returns memories filtered by tags',
  })
  @ApiQuery({
    name: 'tags',
    required: true,
    type: String,
    description: 'Comma-separated list of tags',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Memories retrieved successfully',
    type: [MemoryResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getByTags(
    @Query('tags') tags: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @CurrentUser() user: User,
  ) {
    const tagArray = tags.split(',').map((t) => t.trim());
    return this.memoryService.findByTags(user.id, tagArray, limit);
  }

  @Get('source/:sourceType/:sourceId')
  @ApiOperation({
    summary: 'Get memories by source',
    description: 'Returns memories linked to a specific source (file, note, etc.)',
  })
  @ApiParam({ name: 'sourceType', description: 'Source type' })
  @ApiParam({ name: 'sourceId', description: 'Source ID' })
  @ApiResponse({
    status: 200,
    description: 'Memories retrieved successfully',
    type: [MemoryResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBySource(
    @Param('sourceType') sourceType: string,
    @Param('sourceId') sourceId: string,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.findBySource(user.id, sourceType, sourceId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get memory by ID',
    description: 'Returns detailed memory information',
  })
  @ApiParam({ name: 'id', description: 'Memory ID' })
  @ApiResponse({
    status: 200,
    description: 'Memory retrieved successfully',
    type: MemoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Memory not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.memoryService.findById(id, user.id);
  }

  @Get(':id/related')
  @ApiOperation({
    summary: 'Get related memories',
    description: 'Returns memories linked to the specified memory',
  })
  @ApiParam({ name: 'id', description: 'Memory ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Related memories retrieved successfully',
    type: [MemoryResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Memory not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRelated(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.getRelated(id, user.id, limit);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update memory',
    description: 'Updates memory title, content, status, tags, or metadata',
  })
  @ApiParam({ name: 'id', description: 'Memory ID' })
  @ApiResponse({
    status: 200,
    description: 'Memory updated successfully',
    type: MemoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Memory not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
    @CurrentUser() user: User,
  ) {
    return this.memoryService.update(id, user.id, updateMemoryDto);
  }

  @Post(':id/link/:targetId')
  @ApiOperation({
    summary: 'Link two memories',
    description: 'Creates a relationship link between two memories',
  })
  @ApiParam({ name: 'id', description: 'Source memory ID' })
  @ApiParam({ name: 'targetId', description: 'Target memory ID' })
  @ApiQuery({
    name: 'relationship',
    required: false,
    enum: ['related', 'parent', 'child', 'reference', 'similar'],
    description: 'Relationship type',
  })
  @ApiResponse({
    status: 200,
    description: 'Memories linked successfully',
    type: MemoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Memory not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async linkMemories(
    @Param('id') id: string,
    @Param('targetId') targetId: string,
    @Query('relationship') relationship?: 'related' | 'parent' | 'child' | 'reference' | 'similar',
    @CurrentUser() user?: User,
  ) {
    if (!user) {
      throw new Error('User not found');
    }

    return this.memoryService.linkMemories(
      id,
      targetId,
      user.id,
      relationship || 'related',
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete memory',
    description: 'Soft deletes a memory (marks as deleted)',
  })
  @ApiParam({ name: 'id', description: 'Memory ID' })
  @ApiResponse({ status: 200, description: 'Memory deleted successfully' })
  @ApiResponse({ status: 404, description: 'Memory not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.memoryService.delete(id, user.id);
    return { message: 'Memory deleted successfully' };
  }
}
