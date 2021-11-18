import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
@ObjectType()
export class Team extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field(() => User)
  @ManyToOne(() => User)
  public leader!: User

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.memberOf)
  public members!: User[]

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
