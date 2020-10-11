import { Field, InputType } from 'type-graphql';

import CostType from '../enums/CostType';

@InputType()
export class CostEditInput {
  @Field(() => CostType, { nullable: true })
  public type!: CostType

  @Field(() => String, { nullable: true })
  public name!: string

  @Field(() => Date, { nullable: true })
  public date!: Date

  @Field(() => Number, { nullable: true })
  public value!: number
}
