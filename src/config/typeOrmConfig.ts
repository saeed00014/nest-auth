import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PasswordRules } from 'src/auth/entity/passwordRules.entity';

import { User } from 'src/users/entity/user.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DATABASE_HOST'),
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, PasswordRules],
    // logging: true,
    synchronize: true,
  }),
  inject: [ConfigService],
};
