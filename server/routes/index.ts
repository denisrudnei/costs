import { Router } from 'express'
import AuthController from '@/controllers/AuthController'
import session from 'express-session'

const router = Router()

router.use(
  session({
    secret: process.env.SECRET!,
  })
)

router.use('/api/', AuthController)

router.use('*', (_, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not found',
  })
})

export default router
