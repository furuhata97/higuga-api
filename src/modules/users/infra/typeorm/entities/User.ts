import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Address from './Address';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Address, address => address.user, {
    cascade: true,
    eager: true,
  })
  addresses: Address[];

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column({ type: 'boolean' })
  is_admin: boolean;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
