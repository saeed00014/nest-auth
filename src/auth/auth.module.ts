import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { PasswordRules } from './entity/passwordRules.entity';
import { passwordValidator } from 'src/users/entity/passwordValidator';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordRules])],
  providers: [AuthService, passwordValidator],
  controllers: [AuthController],
})
export class AuthModule {}
