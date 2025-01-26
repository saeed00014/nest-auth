import { Body, Controller, Post } from '@nestjs/common';
import { CreateUser, userCredential } from 'src/users/entity/user.entity';
import { AuthService } from './auth.service';

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
}
