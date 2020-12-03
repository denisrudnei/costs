import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Times {
  @Field()
  user!: number

  @Field()
  nice!: number

  @Field()
  sys!: number

  @Field()
  idle!: number

  @Field()
  irq!: number
}
