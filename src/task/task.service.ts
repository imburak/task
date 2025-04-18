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
      .select([
        'COUNT(*) AS "totalTasks"',
        `COUNT(*) FILTER (WHERE status = '${TaskStatus.PROCESSING}') AS "processing"`,
        `COUNT(*) FILTER (WHERE status = '${TaskStatus.DONE}') AS "done"`,
        `COUNT(*) FILTER (WHERE status = '${TaskStatus.FAILED}') AS "failed"`,
        `COUNT(*) FILTER (WHERE retries > 0) AS "retriedTasks"`,
        `SUM(retries) AS "totalRetries"`,
        `TRUNC(AVG(retries), 1) AS "averageRetriesPerTask"`,
      ])
      .getRawOne()
      .then((result) => ({
        totalTasks: Number(result.totalTasks),
        done: Number(result.done),
        failed: Number(result.failed),
        retries: {
          retriedTasks: Number(result.retriedTasks),
          totalRetries: Number(result.totalRetries),
          averageRetriesPerTask: Number(result.averageRetriesPerTask),
        },
      }));
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
