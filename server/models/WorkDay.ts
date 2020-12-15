import { Length } from 'class-validator';
import { Field, ObjectType, ID } from 'type-graphql';
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class WorkDay extends BaseEntity {
  constructor(workDay: Partial<WorkDay>) {
    super();
    Object.assign(this, workDay);
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field()
  @Length(5)
  @Column({ nullable: false })
  public start!: string

  @Field()
  @Length(5)
  @Column({ nullable: false })
  public finish!: string

  @Field()
  @Column({ nullable: false })
  public day!: Date

  @ManyToOne(() => User)
  public user!: User
}
