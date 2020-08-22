import { Field, Int, ObjectType, ID } from 'type-graphql'
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import CostType from '../enums/CostType'

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

  @Field(() => Date)
  @Column()
  public date: Date = new Date()

  @Column()
  @Field(() => Int)
  public value: number = 0

  @Column({ type: 'enum', enum: CostType })
  @Field(() => CostType)
  public type: CostType = CostType.SPENT
}

export default Cost
