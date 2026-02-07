import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/schemas/user.schema';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create new chat' })
  async create(@Body() body: { title: string }, @CurrentUser() user: User) {
    return this.chatService.create(user.id, body.title || 'New Chat');
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats' })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @CurrentUser() user: User,
  ) {
    return this.chatService.findAll(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chatService.findById(id, user.id);
  }

  @Post(':id/message')
  @ApiOperation({ summary: 'Send message' })
  async sendMessage(
    @Param('id') id: string,
    @Body() body: { content: string },
    @CurrentUser() user: User,
  ) {
    return this.chatService.sendMessage(id, user.id, body.content);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chat' })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.chatService.delete(id, user.id);
    return { message: 'Chat deleted' };
  }
}
