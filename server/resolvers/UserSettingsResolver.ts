import { Query, Resolver, Mutation, Arg } from 'type-graphql'
import UserSettingsInput from '../inputs/UserSettingsInput'
import UserSettingsService from '~/services/UserSettingsService'
import UserSettings from '~/models/UserSettings'

@Resolver()
class UserSettingsResolver {
  @Query(() => UserSettings)
  UserSettings() {
    return UserSettingsService.getUserSettings()
  }

  @Mutation(() => UserSettings)
  CreateUserSettings(@Arg('userSettings') userSettings: UserSettingsInput) {
    const toCreate = new UserSettings(userSettings)
    return UserSettingsService.create(toCreate)
  }
}

export default UserSettingsResolver
