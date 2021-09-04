import {
  Field, Float, ID, ObjectType,
} from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import CostType from '../enums/CostType';
import { User } from './User';

@Entity()
@ObjectType()
export class Forecast extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column({ type: 'enum', enum: CostType, default: 'PROFIT' })
  @Field(() => CostType)
  public type!: CostType

  @Column({ default: new Date() })
  @Field(() => Date)
  public start!: Date

  @Column({ default: new Date() })
  @Field(() => Date)
  public end!: Date

  @Column({ default: false })
  @Field(() => Boolean)
  public indeterminate!: boolean

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  public value: number = 0

  @ManyToOne(() => User)
  public user!: User
}
