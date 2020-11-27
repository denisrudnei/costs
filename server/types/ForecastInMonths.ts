import { Field, Float, ObjectType } from 'type-graphql';

import { ForecastValue } from './ForecastValue';

@ObjectType()
export class ForecastInMonths {
  @Field()
  public name!: string

  @Field()
  public start!: Date

  @Field()
  public end!: Date

  @Field(() => Float)
  public value!: number

  @Field(() => Float)
  public total!: number

  @Field(() => [ForecastValue])
  public values!: ForecastValue[]
}
