import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TASK_QUEUE } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1');

  const configService = app.get(ConfigService);

  const rmqUrl = configService.getOrThrow<string>('rmq.url');
  const concurrency = configService.getOrThrow<number>('rmq.concurrency');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: TASK_QUEUE,
      prefetchCount: concurrency,
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  const port = configService.get<number>('port') as number;

  await app.listen(port);
}
bootstrap();
