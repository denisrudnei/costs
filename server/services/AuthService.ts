import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Raw } from 'typeorm';
import { User } from '../models/User';
import { EmailService } from './EmailService';

type ResetJWT = {
  date: Date
  name: string
  email: string
}

class AuthService {
  public static async login(email: string, password: string) {
    const user = await User.findOne({
      where: {
        // FIXME
        email: Raw((alias) => `${alias} ILIKE '%${email}%'`),
      },
    });
    if (!user) throw new Error('User not found');
    if (!this.verifyPassword(password, user.password)) { throw new Error('Incorrect password'); }
    return user;
  }

  public static async register(email: string, name: string, password: string) {
    const user = await User.findOne({
      where: {
        // FIXME
        email: Raw((alias) => `${alias} ILIKE '%${email}%'`),
      },
    });
    if (user) throw new Error('User registered');
    return User.create({
      email,
      name,
      password,
    }).save();
  }

  public static async sendResetEmail(email: string, url: string) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new Error('User not found');
    const token = jwt.sign({
      date: new Date(),
      name: user.name,
      email: user.email,
    }, process.env.JWT_KEY!);
    await EmailService.SendResetEmail(email, token, url);
    return token;
  }

  public static async resetFromReceivedEmail(token: string, newPassword: string) {
    const info = jwt.decode(token) as ResetJWT;
    const { email } = info;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new Error('User not found');
    user.password = newPassword;
    await user.save();
    return token;
  }

  private static verifyPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export default AuthService;
