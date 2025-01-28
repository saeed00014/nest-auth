import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PasswordRules } from 'src/auth/entity/passwordRules.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'passwordValidator', async: true })
@Injectable()
export class passwordValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(PasswordRules)
    private passwordRulesRepository: Repository<PasswordRules>,
  ) {}
  async validate(value: any, validationArguments?: ValidationArguments) {
    console.log(this.passwordRulesRepository);
    // const passwordRules = await this.passwordRulesRepository.find();
    return true;
  }
}
