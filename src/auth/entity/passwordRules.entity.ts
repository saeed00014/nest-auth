import { IsDate, IsNumberString, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PasswordRules {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  name: string;

  @IsNumberString()
  @Column()
  value: number;

  @IsDate()
  @CreateDateColumn()
  updatedAt: Date;
}
