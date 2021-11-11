import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import qrcode from 'qrcode';
import { User } from '../models/User';
import AuthService from '../services/AuthService';

const router = Router();

router.post('/auth/login', (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  AuthService.login(email, password)
    .then((logged) => {
      const token = jwt.sign(
        {
          id: logged.id,
          email: logged.email,
          name: logged.name,
          role: logged.role,
        },
        process.env.JWT_KEY!,
      );
      req.session!.authUser = logged;
      res.header('authorization', `Bearer ${token}`);
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

router.post('/auth/logout', (req: express.Request, res: express.Response) => {
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

router.get('/auth/connect', (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];
    const user = jwt.decode(token) as User;
    const info = {
      url: process.env.URL,
      username: user.email!,
      password: user.password,
    };
    return res.send(info);
  }
  return res.sendStatus(401);
});

router.get('/auth/qr', async (req: express.Request, res: express.Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];
    const user = jwt.decode(token) as User;
    const info = {
      url: process.env.URL,
      username: user.email!,
      password: user.password,
    };
    const qr = await qrcode.toBuffer(JSON.stringify(info));
    res.header('Content-Type', 'image-png');
    return res.send(qr);
  }
  return res.sendStatus(401);
});

export default router;
