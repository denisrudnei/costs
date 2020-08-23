import { Arg, Mutation, Resolver } from 'type-graphql'

import User from '../models/User'
import AuthService from '../services/AuthService'

@Resolver()
class AuthResolver {
  @Mutation(() => User)
  public Login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    return AuthService.login(email, password)
  }

  @Mutation(() => User)
  public Register(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string
  ): Promise<User> {
    return AuthService.register(email, name, password)
  }
}

export default AuthResolver
