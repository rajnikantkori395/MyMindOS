import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import { MemoryModule } from './modules/memory/memory.module';
import { AiEngineModule } from './modules/ai-engine/ai-engine.module';
import { ChatModule } from './modules/chat/chat.module';
import { TaskModule } from './modules/task/task.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SeederModule } from './database/seeders/seeder.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UserModule,
    FileModule,
    MemoryModule,
    AiEngineModule,
    ChatModule,
    TaskModule,
    AnalyticsModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
