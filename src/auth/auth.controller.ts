import { Body, Controller, ParseArrayPipe, Post, Put } from '@nestjs/common';
import { CreateUser, userCredential } from 'src/users/entity/user.entity';
import { AuthService } from './auth.service';
import { PasswordRules } from './entity/passwordRules.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() user: CreateUser) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() userCredential: userCredential) {
    return this.authService.login(userCredential);
  }

  @Put('/passwordRules')
  updatePasswordRules(@Body() rules: PasswordRules) {
    return this.authService.updatePasswordRules(rules);
  }
}
