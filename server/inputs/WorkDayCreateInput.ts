import { Field, InputType } from 'type-graphql';

@InputType()
export class WorkDayCreateInput {
  @Field(() => Date)
  public day!: Date

  @Field(() => String)
  public start!: string

  @Field(() => String)
  public finish!: string
}
