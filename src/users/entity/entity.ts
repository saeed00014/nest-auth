import { IsString, Validate } from 'class-validator';
import { CustomStringBooleaOrEmpty } from 'src/customValidator/customValidator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

Entity();
export class User {
  @PrimaryColumn()
  id: number;

  @IsString()
  @Column({ nullable: false, unique: true })
  username: string;

  @Validate(CustomStringBooleaOrEmpty)
  @Column({ nullable: false, default: true })
  isActive: boolean;

  @IsString()
  @Column({ nullable: false })
  password: string;
}
