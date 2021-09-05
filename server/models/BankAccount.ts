import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';
import { Cost } from './Cost';

@Entity()
@ObjectType()
export class BankAccount extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  @Field({ description: 'Description for the account' })
  public name!: string

  @Column()
  @Field({ description: 'Agency number' })
  public agency!: String

  @Column()
  @Field({ description: 'Account number for account' })
  public account!: string

  @ManyToOne(() => User)
  @Field(() => User)
  public user!: User

  @OneToMany(() => Cost, (cost) => cost.bankAccount)
  @Field(() => [Cost])
  public costs!: Cost[]
}
