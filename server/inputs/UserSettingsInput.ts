import { InputType, Field } from 'type-graphql';

@InputType()
export class UserSettingsInput {
  @Field()
  public currency!: string

  @Field()
  public locale!: string
}
