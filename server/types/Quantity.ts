import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Quantity {
  @Field(() => String)
  public name!: string

  @Field(() => Int)
  public total!: number
}
