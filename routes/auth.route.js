import express from 'express'
import AuthController from '#controllers/auth.controller.js'
import AuthService from '#services/auth.service.js'
import EmailService from '#services/email.service.js'
import authValidation from '#validations/auth.validation.js'
import authMiddleware from '#middlewares/auth.middleware.js'

const router = express.Router()
const emailService = new EmailService()
const authService = new AuthService(emailService)
const authController = new AuthController(authService)
const { loginValidation, createUserValidation } = authValidation

//  API routes
router.post('/guest-login', authController.guestLogin)
router.post('/login', loginValidation, authController.login)
router.post('/create-user', createUserValidation, authController.createUser)
router.post('/change-password', authMiddleware, authController.changePassword)
router.post('/logout', authMiddleware, authController.logout)

export default router