import { Injectable } from '@nestjs/common';
import { User } from './entity/entity';

@Injectable()
export class UsersService {
  registerUser(user: User) {
    console.log(user);
  }
  loginUser() {}
}
