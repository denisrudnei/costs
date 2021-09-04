import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
@ObjectType()
export class BankAccount extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column()
  @Field()
  public agency!: String

  @Column()
  @Field()
  public account!: string

  @ManyToOne(() => User)
  @Field(() => User)
  public user!: User
}
