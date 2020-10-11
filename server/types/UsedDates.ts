import { Field, ObjectType } from 'type-graphql';
import { Year } from './Year';

@ObjectType()
export class UsedDates {
  @Field(() => [Year])
  public years!: Year[]

  constructor() {
    this.years = [];
  }
}
