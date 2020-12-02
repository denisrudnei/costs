import {
  ObjectType, Int, Field, Float,
} from 'type-graphql';

@ObjectType()
export class Portion {
  @Field(() => Int)
  public number!: number

  @Field(() => Float)
  public portion!: number

  @Field(() => Float)
  public restValue!: number

  @Field(() => Float)
  public paidValue!: number

  @Field(() => Float)
  public interest!: number

  @Field(() => Float)
  public amortizationValue!: number
}
