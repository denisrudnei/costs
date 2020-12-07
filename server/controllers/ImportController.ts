import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { ImportService } from '../services/ImportService';

const router = Router();

type info = {
  id: User['id'],
  email: User['email'],
  name: User['name']
}

router.use('/import', async (req, res) => {
  const jwtString = req.headers.authorization!.replace('Bearer ', '');

  const { email } = (jwt.decode(jwtString) as info);

  const { separator, format, merge } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: 'User not found',
    });
  }

  return ImportService.save(req.files!.file, user, format, separator, merge)
    .then(() => res.status(200).json({
      message: 'Success',
    }))
    .catch((e) => res.status(500).json({
      message: e.message,
    }));
});

export default router;
