import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
export class TotalValueSingleDay {
  @Field(() => Float)
  public total!: number

  @Field(() => Date)
  date!: Date
}
