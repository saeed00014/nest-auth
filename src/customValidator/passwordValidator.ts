import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class passwordValidator implements PipeTransform {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(await this.userRepository.find());
  }
}
