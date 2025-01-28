import { DataSource, Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser, User, userCredential } from 'src/users/entity/user.entity';
import { PasswordRules } from './entity/passwordRules.entity';

@Injectable()
export class AuthService {
  constructor(
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

  async updatePasswordRules(rules: PasswordRules) {
    return this.passwordRulesRepository.update({ id: 1 }, rules);
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
