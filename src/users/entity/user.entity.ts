import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IsString, Validate } from 'class-validator';
import { CustomBooleanStringOrEmpty } from 'src/customValidator/customValidator';

import { OmitType, PickType } from '@nestjs/mapped-types';

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

  @IsString()
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

export class userCredential extends PickType(User, [
  'username',
  'password',
] as const) {}
