import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        /* eslint-disable */
        const database = configService.get<any>('database');

        return {
          ...database,
          synchronize: true, // Only for development. Disable in production!
          autoLoadEntities: true,
        }; /* eslint-enable */
      },
      inject: [ConfigService],
    }),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
