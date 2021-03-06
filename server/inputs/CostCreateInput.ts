import { Field, InputType } from 'type-graphql';

import CostType from '../enums/CostType';

@InputType()
export class CostCreateInput {
  @Field(() => CostType)
  public type!: CostType

  @Field(() => String)
  public name!: string

  @Field(() => Date)
  public date!: Date

  @Field(() => Number)
  public value!: number
}
