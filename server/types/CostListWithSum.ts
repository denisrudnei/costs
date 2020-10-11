import { Field, ObjectType } from 'type-graphql';
import { Cost } from '../models/Cost';

@ObjectType()
export class CostListWithSum<T> {
  @Field(() => [Cost])
  public values!: T[]

  @Field()
  public sum!: number
}
