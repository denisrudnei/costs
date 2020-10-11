import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SummaryDayByDay {
  @Field()
  public day!: Date

  @Field()
  public total!: number
}
