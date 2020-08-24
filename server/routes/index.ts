import AuthController from '@/controllers/AuthController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Router } from 'express'
import session from 'express-session'

const router = Router()

router.use(cors())

router.use(
  session({
    secret: process.env.SECRET!,
    saveUninitialized: false,
  })
)

router.use(bodyParser.json())

router.use('/api/', AuthController)

export default router
