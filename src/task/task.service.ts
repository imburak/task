import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  createTask(message: string) {
    return this.taskRepo.save({ message });
  }

  getResults() {
    return this.taskRepo.find({
      where: { status: In([TaskStatus.DONE, TaskStatus.FAILED]) },
      order: { createdAt: 'DESC' },
    });
  }

  async getProcessingStats() {
    return this.taskRepo
      .createQueryBuilder()
      .select('status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany();
  }

  async updateTask(
    id: string,
    data: QueryDeepPartialEntity<Task>,
  ): Promise<Task> {
    return this.taskRepo
      .createQueryBuilder()
      .update<Task>(Task, data)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute()
      .then((result) => result.raw[0] as Task);
  }
}
