import express from 'express'
import AuthController from '@controllers/auth.controller.js'
import logger from '../logger.js'

const router = express.Router()
const authController = new AuthController(logger)

//  API routes
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/create-user', authController.createUser)
router.post('/refresh-token', authController.refreshToken)

export default router