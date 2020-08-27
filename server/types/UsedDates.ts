import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
class UsedDates {
  @Field(() => [Year])
  public years!: Year[]

  constructor() {
    this.years = []
  }
}

@ObjectType()
export class Year {
  @Field(() => Int)
  public value!: number

  @Field(() => [Int])
  public months!: Month
}

export type Month = Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>

export default UsedDates
