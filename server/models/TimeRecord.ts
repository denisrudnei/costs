import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './User';

@ObjectType()
@Entity()
export class TimeRecord extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column({ default: new Date() })
  public date!: Date

  @Field(() => User)
  @ManyToOne(() => User)
  public user!: User

  @Field()
  @Column({ default: true })
  public manual!: boolean

  @Field()
  @CreateDateColumn()
  public createdAt!: Date

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date
}
