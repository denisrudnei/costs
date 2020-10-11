import { Field, Int, ObjectType } from 'type-graphql';
import { Month } from './Month';

@ObjectType()
export class Year {
  @Field(() => Int)
  public value!: number

  @Field(() => [Int])
  public months!: Month
}
