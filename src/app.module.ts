import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { TypeORMErrorFilter } from './exceptionFIlter/typeORMErrorFilter';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { typeOrmConfig } from './config/typeOrmConfig';
import { mongodbConfig } from './config/mongodbConfig';
import { jwtConfig } from './config/jwtConfig';
import { configModuleConfig } from './config/configModuleConfig';
import { passwordValidator } from './users/entity/passwordValidator';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleConfig),
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    MongooseModule.forRootAsync(mongodbConfig),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: TypeORMErrorFilter,
    },
  ],
})
export class AppModule {}
