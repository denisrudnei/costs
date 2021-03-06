import jwt from 'jsonwebtoken';
import {
  Arg, Ctx, Mutation, Resolver,
} from 'type-graphql';
import { CustomExpressContext } from '../types/CustomSession';

import { User } from '../models/User';
import AuthService from '../services/AuthService';

@Resolver()
class AuthResolver {
  @Mutation(() => User)
  public async Login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() context: CustomExpressContext,
  ): Promise<User> {
    const user = await AuthService.login(email, password);
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY!,
    );
    context.req.session!.authUser = user;
    context.res.setHeader('authorization', `Bearer ${token}`);
    return user;
  }

  @Mutation(() => String)
  SendResetEmail(@Arg('email') email: string, @Arg('url') url: string) {
    return AuthService.sendResetEmail(email, url);
  }

  @Mutation(() => String)
  ResetFromReceivedEmail(@Arg('token') token: string, @Arg('newPassword') newPassword: string) {
    return AuthService.resetFromReceivedEmail(token, newPassword);
  }

  @Mutation(() => User)
  public Register(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string,
  ): Promise<User> {
    return AuthService.register(email, name, password);
  }
}

export default AuthResolver;
