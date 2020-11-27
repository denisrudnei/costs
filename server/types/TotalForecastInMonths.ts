import { Field, ObjectType, Float } from 'type-graphql';

@ObjectType()
export class TotalForecastInMonths {
  @Field(() => [String])
  public names!: string[]

  @Field()
  public date!: Date

  @Field(() => Float)
  public total!: number
}
