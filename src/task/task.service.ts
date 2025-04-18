import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  createTask(message: string) {
    return this.taskRepo.save({ message });
  }
}
