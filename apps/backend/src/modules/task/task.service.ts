import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private logger: LoggerService,
  ) {}

  async create(userId: string, data: any) {
    const task = new this.taskModel({ ...data, userId });
    return task.save();
  }

  async findById(id: string, userId: string) {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  async findAll(userId: string, filters: any = {}, page = 1, limit = 20) {
    const query: any = { userId, deletedAt: null };
    if (filters.status) query.status = filters.status;
    if (filters.tags) query.tags = { $in: filters.tags };
    
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.taskModel.find(query).sort({ dueDate: 1, createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    if (data.status === 'completed' && !data.completedAt) {
      data.completedAt = new Date();
    }
    return this.taskModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await this.taskModel.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }
}
