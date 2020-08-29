import { Field, ObjectType } from 'type-graphql'

@ObjectType()
class SummaryDayByDay {
  @Field()
  public day!: Date

  @Field()
  public total!: number
}

export default SummaryDayByDay
