import { Authorized, Query, Resolver } from 'type-graphql';

import { Role } from '../enums/Role';
import { User } from '../models/User';
import UserService from '../services/UserService';

@Resolver(() => User)
class UserResolver {
  @Query(() => [User])
  @Authorized(Role.ADMIN)
  public User() {
    return UserService.getAll();
  }
}

export default UserResolver;
