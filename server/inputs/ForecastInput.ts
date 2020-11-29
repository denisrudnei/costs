import { InputType, Field } from 'type-graphql';
import CostType from '../enums/CostType';

@InputType()
export class ForecastInput {
  @Field()
  public name!: string

  @Field(() => CostType)
  public type!: CostType

  @Field()
  public start!: Date

  @Field()
  public end!: Date

  @Field()
  public indeterminate!: boolean

  @Field()
  public value!: number
}
