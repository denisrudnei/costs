import { Router } from 'express';
import jwt from 'jsonwebtoken';
import AuthService from '../services/AuthService';

const router = Router();

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  AuthService.login(email, password)
    .then((logged) => {
      const token = jwt.sign(
        {
          id: logged.id,
          email: logged.email,
          name: logged.name,
        },
        process.env.JWT_KEY!,
      );
      req.session!.authUser = logged;
      res.status(200).json({
        user: token,
      });
    })
    .catch((e) => {
      res.status(500).json({
        status: 500,
        message: e.message,
      });
    });
});

router.post('/auth/logout', (req, res) => {
  delete req.session!.authUser;
  res.set('authorization', undefined);
  res.sendStatus(200);
});

router.post('/auth/user', (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];
    const user = jwt.decode(token);
    res.status(200).json({
      user,
    });
  }
});

export default router;
