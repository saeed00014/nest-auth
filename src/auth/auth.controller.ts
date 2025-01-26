import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CreateUser, userCredential } from 'src/users/entity/user.entity';
import { AuthService } from './auth.service';
import { PasswordRules } from './entity/passwordRules.entity';
import { passwordValidator } from './pipe/passwordValidator.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(passwordValidator)
  @Post('/register')
  register(@Body() user: CreateUser) {
    return this.authService.register(user);
  }

  @UsePipes(passwordValidator)
  @Post('/login')
  login(@Body() userCredential: userCredential) {
    return this.authService.login(userCredential);
  }

  @Post('/passwordRules')
  createPasswordRules(@Body(ParseArrayPipe) rules: PasswordRules[]) {
    return this.authService.createPasswordRules(rules);
  }

  @Put('/passwordRules')
  updatePasswordRules(@Body(ParseArrayPipe) rules: PasswordRules[]) {
    return this.authService.updatePasswordRules(rules);
  }
}
