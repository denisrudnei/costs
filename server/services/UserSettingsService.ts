import UserSettings from '~/models/UserSettings'

class UserSettingsService {
  public static async create(
    userSettings: UserSettings
  ): Promise<UserSettings> {
    const inDb = await UserSettings.findOne()
    if (inDb) {
      Object.assign(inDb, userSettings)
      return inDb.save()
    }
    return UserSettings.create(userSettings).save()
  }

  public static getUserSettings() {
    return UserSettings.findOne()
  }
}

export default UserSettingsService
