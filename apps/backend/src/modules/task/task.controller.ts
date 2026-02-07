import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/schemas/user.schema';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  async create(@Body() body: any, @CurrentUser() user: User) {
    return this.taskService.create(user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('tags') tags?: string,
    @CurrentUser() user?: User,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (tags) filters.tags = tags.split(',');
    return this.taskService.findAll(user!.id, filters, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.taskService.findById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  async update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: User) {
    return this.taskService.update(id, user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.taskService.delete(id, user.id);
    return { message: 'Task deleted' };
  }
}
