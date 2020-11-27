import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ForecastValue {
  @Field()
  public name!: string

  @Field()
  public date!: Date

  @Field()
  public value!: number
}
