import bodyParser from 'body-parser';
import cors from 'cors';
import { Router } from 'express';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import ExportController from '@/controllers/ExportController';
import ImportController from '@/controllers/ImportController';
import AuthController from '@/controllers/AuthController';

const router = Router();

router.use(cors());

router.use(
  session({
    secret: process.env.SECRET!,
    resave: true,
    saveUninitialized: false,
  }),
);

router.use(bodyParser.json());

router.use(fileUpload());

router.use('/api', ImportController);
router.use('/api', ExportController);
router.use('/api', AuthController);

export default router;
