import { InputType, Field } from 'type-graphql'

@InputType()
class UserSettingsInput {
  @Field()
  public currency!: string

  @Field()
  public locale!: string
}

export default UserSettingsInput
