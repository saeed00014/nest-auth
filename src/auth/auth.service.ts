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

  async passwordRules(rules: PasswordRules[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.clear(PasswordRules);

      const savedRulesResult = Promise.all(
        rules.map((rule) => {
          if (PasswordRuleNames[rule.name]) {
            queryRunner.manager.save(PasswordRules, rule);
          }
          throw new HttpException(
            `your request body is not valid`,
            HttpStatus.BAD_REQUEST,
          );
        }),
      );
      await queryRunner.commitTransaction();

      return savedRulesResult;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
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
