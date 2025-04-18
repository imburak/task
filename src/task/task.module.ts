import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],

  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
