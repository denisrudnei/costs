import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import jwt from 'jsonwebtoken'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'

import User from '../models/User'
import AuthService from '../services/AuthService'

@Resolver()
class AuthResolver {
  @Mutation(() => User)
  public async Login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() context: ExpressContext
  ): Promise<User> {
    const user = await AuthService.login(email, password)
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY!
    )

    context.res.set('authorization', `Bearer ${token}`)
    return user
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
