import {
  Field, Float, InputType, Int,
} from 'type-graphql';

@InputType()
export class LoanCreateInput {
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
