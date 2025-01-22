import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './exceptionFIlter/exceptionFilter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get('DATABASE_HOST'),
        port: ConfigService.get('DATABASE_PORT'),
        username: ConfigService.get('DATABASE_USERNAME'),
        password: ConfigService.get('DATABASE_PASSWORD'),
        database: ConfigService.get('DATABASE_NAME'),
        entities: [User],
        logging: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
