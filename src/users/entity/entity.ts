import { Column, Entity, PrimaryColumn } from 'typeorm';

Entity();
export class User {
  @PrimaryColumn()
  id: number;

  @
  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  password: string;
}
