import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schemas/chat.schema';
import { LoggerService } from '../../common/logger/logger.service';
import { AiEngineService } from '../ai-engine/ai-engine.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private logger: LoggerService,
    private aiEngineService: AiEngineService,
  ) {}

  async create(userId: string, title: string) {
    const chat = new this.chatModel({ userId, title, messages: [] });
    return chat.save();
  }

  async findById(id: string, userId: string) {
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.userId !== userId) throw new ForbiddenException();
    return chat;
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.chatModel
        .find({ userId, deletedAt: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.chatModel.countDocuments({ userId, deletedAt: null }).exec(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async addMessage(id: string, userId: string, role: 'user' | 'assistant', content: string) {
    const chat = await this.findById(id, userId);
    chat.messages.push({ role, content, timestamp: new Date() });
    return chat.save();
  }

  async sendMessage(id: string, userId: string, content: string) {
    const chat = await this.findById(id, userId);
    
    // Add user message
    chat.messages.push({ role: 'user', content, timestamp: new Date() });
    
    // Generate AI response
    const aiResponse = await this.aiEngineService.chat({
      messages: chat.messages.map(m => ({ role: m.role, content: m.content })),
    });
    
    // Add assistant response
    chat.messages.push({
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
    });
    
    return chat.save();
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await this.chatModel.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }
}
