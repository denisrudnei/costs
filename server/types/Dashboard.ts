import { Field, ObjectType } from 'type-graphql';
import { Quantity } from './Quantity';

@ObjectType()
export class Dashboard {
  @Field(() => [Quantity])
  public quantities!: Quantity[]
}
