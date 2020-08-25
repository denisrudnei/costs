import { Field, Float, ObjectType } from 'type-graphql'

@ObjectType()
class SummaryGroupedByDate {
  @Field(() => [TotalValueSingleDay])
  public profits!: TotalValueSingleDay[]

  @Field(() => [TotalValueSingleDay])
  public spending!: TotalValueSingleDay[]
}

@ObjectType()
class TotalValueSingleDay {
  @Field(() => Float)
  public total!: number

  @Field(() => Date)
  date!: Date
}

export default SummaryGroupedByDate
