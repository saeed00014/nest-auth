import { DataSource, Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser, User, userCredential } from 'src/users/entity/user.entity';
import { PasswordRules } from './entity/passwordRules.entity';
import { PasswordRuleNames } from './enums/passwordRulesName';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(PasswordRules)
    private passwordRulesRepository: Repository<PasswordRules>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(user: CreateUser) {
    const didFindUser = await this.usersRepository.existsBy({
      username: user.username,
    });

    if (didFindUser)
      throw new HttpException('this username is taken', HttpStatus.BAD_REQUEST);

    const hashedPassword = await this.getHashedPassword(user.password);
    const createdUser = await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });

    const accessToken = await this.getJwtAccessToken({
      username: createdUser.username,
    });

    return { username: createdUser.username, accessToken: accessToken };
  }

  async login(userCredential: userCredential) {
    const password = userCredential.password;
    const username = userCredential.username;
    const foundedUser = await this.usersRepository.findOneBy({
      username: username,
    });

    const compareResult = await bcrypt.compare(password, foundedUser.password);

    if (compareResult) {
      const accessToken = await this.getJwtAccessToken({ username });
      return { username: username, accessToken: accessToken };
    }

    throw new HttpException(
      'username or password is wrong',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async createPasswordRules(rules: PasswordRules[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const results = await Promise.all(
        rules.map(async (rule) => {
          if (PasswordRuleNames[rule.name]) {
            return await queryRunner.manager.save(PasswordRules, rule);
          }
        }),
      );

      if (results.filter((d) => d).length !== rules.length) {
        throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      }

      await queryRunner.commitTransaction();
      return results;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async updatePasswordRules(rules: PasswordRules[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const results = await Promise.all(
        rules.map(async (rule) => {
          if (PasswordRuleNames[rule.name]) {
            const foundedRule = await queryRunner.manager.findOneBy(
              PasswordRules,
              { name: rule.name },
            );
            foundedRule.value = rule.value;
            return await queryRunner.manager.save(PasswordRules, foundedRule);
          }
        }),
      );

      if (results.filter((d) => d).length !== rules.length) {
        throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      }

      await queryRunner.commitTransaction();
      return results;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async getJwtAccessToken(payload: any) {
    const jwtToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return jwtToken;
  }
}
