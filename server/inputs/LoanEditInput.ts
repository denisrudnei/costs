import {
  Field, Float, InputType, Int, ID,
} from 'type-graphql';

@InputType()
export class LoanEditInput {
  @Field(() => ID)
  public id!: number

  @Field()
  public name!: string

  @Field(() => Float)
  public interest: number = 0

  @Field(() => Float)
  public advanceInterest: number = 0

  @Field(() => Float)
  public total: number = 0

  @Field(() => Int)
  public portions: number = 0
}
