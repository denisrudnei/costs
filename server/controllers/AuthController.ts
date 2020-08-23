import { Router } from 'express'
import AuthService from '../services/AuthService'

const router = Router()

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  AuthService.login(email, password)
    .then((logged) => {
      req.session!.authUser = logged
      res.status(200).json({
        user: logged,
      })
    })
    .catch((e) => {
      res.status(500).json({
        status: 500,
        message: e.message,
      })
    })
})

router.post('/auth/logout', (req, _) => {
  delete req.session!.authUser
})

router.post('/auth/user', (req, res) => {
  res.status(200).json({
    user: req.session!.authUser,
  })
})

export default router
