import { Field, InputType } from 'type-graphql';

@InputType()
export class BankAccountCreateInput {
  @Field()
  public name!: string

  @Field()
  public agency!: String

  @Field()
  public account!: string
}
