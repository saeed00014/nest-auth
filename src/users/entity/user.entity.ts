import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IsString, Validate } from 'class-validator';
import { CustomBooleanStringOrEmpty } from 'src/customValidator/customValidator';

import { OmitType, PickType } from '@nestjs/mapped-types';
import { passwordValidator } from 'src/users/entity/passwordValidator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ nullable: false, unique: true })
  username: string;

  @Validate(CustomBooleanStringOrEmpty)
  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  password: string;
}

export class ResponseUserInfo extends OmitType(User, [
  'id',
  'password',
] as const) {}

export class CreateUser extends PickType(User, [
  'username',
  'password',
] as const) {}

export class userCredential {
  @IsString()
  @Column({ nullable: false, unique: true })
  username: string;

  @Validate(passwordValidator)
  @Column({ nullable: false })
  password: string;
}
