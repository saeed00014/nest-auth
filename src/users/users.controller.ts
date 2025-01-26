import { Controller, Get, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
