import {
  ObjectType, Field, Float, Int,
} from 'type-graphql';
import CostType from '../enums/CostType';

@ObjectType()
export class SummaryTotalByMonth {
  @Field(() => Int)
  public month!: number

  @Field(() => Int)
  public year!: number

  @Field(() => CostType)
  public type!: CostType

  @Field(() => Float)
  public total!: number
}
