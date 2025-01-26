import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordRules } from 'src/auth/entity/passwordRules.entity';
import { PasswordRuleNames } from 'src/auth/enums/passwordRulesName';
import { userCredential } from 'src/users/entity/user.entity';

@Injectable()
export class passwordValidator implements PipeTransform {
  constructor(
    @InjectRepository(PasswordRules)
    private passwordRulesRepository: Repository<PasswordRules>,
  ) {}

  async transform(value: userCredential, metadata: ArgumentMetadata) {
    const password = value.password;
    const foundedPasswordRules = await this.passwordRulesRepository.find();
    const minLength = foundedPasswordRules.find(
      (rule) => rule.name == PasswordRuleNames.minLength,
    );
    const maxLength = foundedPasswordRules.find(
      (rule) => rule.name == PasswordRuleNames.maxLength,
    );

    const passwordLength = password.length;
    if (minLength && passwordLength < minLength.value)
      this.httpUnauthorizedErrorWithMessage('گوتاه است');
    if (maxLength && passwordLength > maxLength.value)
      this.httpUnauthorizedErrorWithMessage('طولانی است');

    return value;
  }

  httpUnauthorizedErrorWithMessage(message: string) {
    throw new HttpException(message, HttpStatus.UNAUTHORIZED);
  }
}
