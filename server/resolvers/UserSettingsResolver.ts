import {
  Query, Resolver, Mutation, Arg, Authorized, Ctx,
} from 'type-graphql';
import { CustomExpressContext } from '../types/CustomSession';
import { UserSettingsInput } from '../inputs/UserSettingsInput';
import UserSettingsService from '~/services/UserSettingsService';
import { UserSettings } from '~/models/UserSettings';
import { Role } from '../enums/Role';

@Resolver()
class UserSettingsResolver {
  @Query(() => UserSettings)
  @Authorized(Role.USER)
  UserSettings(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return UserSettingsService.getUserSettings(id);
  }

  @Mutation(() => UserSettings)
  @Authorized(Role.USER)
  CreateUserSettings(
    @Arg('userSettings') userSettings: UserSettingsInput,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const { id } = req.session!.authUser!;
    const toCreate = new UserSettings(userSettings);
    return UserSettingsService.create(toCreate, id);
  }
}

export default UserSettingsResolver;
