import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateUser, userCredential } from 'src/users/entity/user.entity';
import { AuthService } from './auth.service';
import { passwordValidator } from 'src/customValidator/passwordValidator';
import { PasswordRules } from './entity/passwordRules.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(passwordValidator)
  @Post('/register')
  register(@Body() user: CreateUser) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() userCredential: userCredential) {
    return this.authService.login(userCredential);
  }

  @Post('/passwordRules')
  passwordRules(@Body(ParseArrayPipe) rules: PasswordRules[]) {
    return this.authService.passwordRules(rules);
  }
}
