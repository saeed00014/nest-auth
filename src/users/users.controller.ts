import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  registerUser(@Body() user: User) {
    return this.usersService.registerUser(user);
  }

  @Post('/login')
  loginUser() {
    this.usersService.loginUser();
  }
}
