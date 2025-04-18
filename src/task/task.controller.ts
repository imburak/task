import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private taskService: TaskService) {}

  @Get('results')
  getResults() {
    return [];
  }

  @Get('stats')
  getStats() {
    return [];
  }

  @Post()
  async createTask(@Body() body: CreateTaskDto) {
    try {
      const task = await this.taskService.createTask(body.message);
      return task;
    } catch (error) {
      this.logger.error(`Failed to create task`, error);
      throw new InternalServerErrorException('Task could not be created');
    }
  }
}
