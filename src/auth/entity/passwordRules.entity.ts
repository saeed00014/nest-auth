import { IsBoolean, IsNumber } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PasswordRules {
  @PrimaryColumn({ default: 1 })
  id: number;

  @IsNumber()
  @Column()
  maxLength: number;

  @IsNumber()
  @Column()
  minLength: number;

  @IsBoolean()
  @Column()
  hasNumber: boolean;

  @IsBoolean()
  @Column()
  hasUpperCase: boolean;

  @IsBoolean()
  @Column()
  hasSpecialChars: boolean;
}
