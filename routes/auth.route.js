import express from 'express'
import AuthController from '#controllers/auth.controller.js'
import AuthService from '#services/auth.service.js'
import authValidation from '#validations/auth.validation.js'
import authMiddleware from '#middlewares/auth.middleware.js'

const router = express.Router()
const authService = new AuthService()
const authController = new AuthController(authService)
const { loginValidation, createUserValidation } = authValidation

router.post('/guest-login', authController.guestLogin)
router.post('/login', loginValidation, authController.login)
router.post('/create-user', createUserValidation, authController.createUser)
router.post('/change-password', authMiddleware, authController.changePassword)
router.post('/forgot-password', authController.forgotPassword)
router.post('/set-new-password', authController.setNewPassword)
router.post('/logout', authMiddleware, authController.logout)

export default router