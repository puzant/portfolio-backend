import express from 'express'
import AuthController from '../controllers/authController.js'
import logger from '../logger.js'

const router = express.Router()
const authController = new AuthController(logger)

//  API routes
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/create-user', authController.createUser)
router.post('/refresh-token', authController.refreshToken)

// rendering routes
router.get('/login', authController.renderLogin)

export default router