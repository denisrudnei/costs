import { ObjectType, Field } from 'type-graphql'
import CostType from '../enums/CostType'
import Cost from '~/models/Cost'

type CostAsProfit = {
  type: CostType.PROFIT
}

type CostAsSpent = {
  type: CostType.SPENT
}

export type Profit = CostAsProfit & Cost
export type Spent = CostAsSpent & Cost

@ObjectType()
export class CostListWithSum<T> {
  @Field(() => [Cost])
  public values!: T[]

  @Field()
  public sum!: number
}

@ObjectType()
export class BasicSummary {
  @Field()
  public profits!: CostListWithSum<Profit>

  @Field()
  public spending!: CostListWithSum<Spent>

  @Field()
  public total!: number
}
