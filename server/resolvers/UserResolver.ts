import { Authorized, Query, Resolver } from 'type-graphql';

import { User } from '../models/User';
import UserService from '../services/UserService';

@Resolver(() => User)
class UserResolver {
  @Query(() => [User])
  @Authorized('ADMIN')
  public User() {
    return UserService.getAll();
  }
}

export default UserResolver;
