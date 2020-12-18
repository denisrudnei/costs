import express from 'express';
import jwt from 'jsonwebtoken';

import { User } from './models/User';

type info = {
  id: User['id'],
  email: User['email'],
  name: User['name']
}

export async function getUser(req: express.Request) {
  const jwtString = req.headers.authorization!.replace('Bearer ', '');

  const { email } = (jwt.decode(jwtString) as info);

  const user = await User.findOne({
    where: {
      email,
    },
  });
  return user;
}
