import { Field, ObjectType, Int } from 'type-graphql';
import { Cost } from '../../server/models/Cost';

@ObjectType()
export class CostPagination {
  constructor(options: CostPagination) {
    Object.assign(this, options);
  }

  @Field(() => [Cost])
  public costs!: Cost[]

  @Field(() => Int)
  public pages!: number

  @Field(() => Int)
  public page!: number

  @Field(() => Int)
  public limit: 5 | 10 | 15 | 20 | 25 = 10
}
