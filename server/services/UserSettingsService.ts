import { User } from '../models/User';
import { UserSettings } from '../models/UserSettings';

class UserSettingsService {
  public static async create(
    userSettings: UserSettings,
    userId: User['id'],
  ): Promise<UserSettings> {
    const user = await User.findOne(userId, {
      relations: ['settings'],
    });
    if (!user) throw new Error('User not found');
    if (!user.settings) {
      const settings = UserSettings.create();
      Object.assign(settings, userSettings);
      await settings.save();

      user.settings = settings;
      await user.save();
      return user.settings;
    }
    Object.assign(user.settings, userSettings);
    await user.settings.save();
    return user.settings;
  }

  public static async getUserSettings(userId: User['id']) {
    const user = await User.findOne(userId, {
      relations: ['settings'],
    });
    if (!user) throw new Error('User not found');
    return user.settings;
  }
}

export default UserSettingsService;
