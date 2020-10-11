import bcrypt from 'bcryptjs';

import { ILike } from '../db/FindOperator';
import { User } from '../models/User';

class AuthService {
  public static async login(email: string, password: string) {
    const user = await User.findOne({
      where: {
        email: ILike(email),
      },
    });
    if (!user) throw new Error('User not found');
    if (!this.verifyPassword(password, user.password)) { throw new Error('Incorrect password'); }
    return user;
  }

  public static async register(email: string, name: string, password: string) {
    const user = await User.findOne({
      where: {
        email: ILike(email),
      },
    });
    if (user) throw new Error('User registered');
    return User.create({
      email,
      name,
      password,
    }).save();
  }

  private static verifyPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export default AuthService;
