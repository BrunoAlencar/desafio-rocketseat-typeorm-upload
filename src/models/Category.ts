import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Transaction from './Transaction';

@Entity('categories')
export default class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transaction: Transaction;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
