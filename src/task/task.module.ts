import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerController } from './consumer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TASK_QUEUE, TASK_SERVICE } from 'src/config/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: TASK_SERVICE,
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>('rmq.url') as string;

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: TASK_QUEUE,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],

  controllers: [TaskController, ConsumerController],
  providers: [TaskService],
})
export class TaskModule {}
