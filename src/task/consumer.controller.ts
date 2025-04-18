import { Controller, Inject, Logger } from '@nestjs/common';
import { TaskService } from './task.service';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Task, TaskStatus } from './entities/task.entity';
import {
  DEFAULT_DELAY_MS,
  DEFAULT_RETRY_COUNT,
  TASK_SERVICE,
} from 'src/config/constants';
import type { Channel, ConsumeMessage } from 'amqplib';

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  constructor(
    private taskService: TaskService,
    @Inject(TASK_SERVICE) private client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
    }
  }

  @MessagePattern('task_created')
  async processTask(@Payload() data: Task, @Ctx() context: RmqContext) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef() as unknown as Channel;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const originalMsg = context.getMessage() as unknown as ConsumeMessage;

    const task = await this.taskService.updateTask(data.id, {
      status: TaskStatus.PROCESSING,
    });

    const retries = task.retries || 0;

    this.logger.log(`Processing task ${task.id} with ${retries} retries.`);

    try {
      await this.simulateDelay();

      if (this.shouldFail()) throw new Error('Simulated task failure');

      await this.taskService.updateTask(data.id, {
        status: TaskStatus.COMPLETED,
      });
      channel.ack(originalMsg);
      this.logger.log(`Task ${task.id} completed after ${retries} retires.`);
    } catch (error) {
      if (retries < DEFAULT_RETRY_COUNT) {
        await this.taskService.updateTask(data.id, {
          status: TaskStatus.PROCESSING,
          retries: retries + 1,
        });
        channel.reject(originalMsg);
      } else {
        await this.taskService.updateTask(data.id, {
          status: TaskStatus.FAILED,
        });
        this.logger.error(
          `Task ${task.id} failed after ${retries} retries`,
          error,
        );

        channel.ack(originalMsg);
      }
    }
  }

  private simulateDelay() {
    return new Promise((r) => setTimeout(r, DEFAULT_DELAY_MS));
  }

  private shouldFail() {
    return Math.random() > 0.4;
  }
}
