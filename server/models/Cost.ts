import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import CostType from '../enums/CostType'
import User from './User'

@ObjectType()
@Entity()
class Cost extends BaseEntity {
  constructor(cost?: Partial<Cost>) {
    super()
    Object.assign(this, cost)
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field(() => Date)
  @Column()
  public date: Date = new Date()

  @Column({ type: 'decimal' })
  @Field(() => Number)
  public value: number = 0

  @ManyToOne(() => User)
  public user!: User

  @Column({ type: 'enum', enum: CostType })
  @Field(() => CostType)
  public type: CostType = CostType.SPENT
}

export default Cost
