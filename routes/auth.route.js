import express from 'express'
import AuthController from '#controllers/auth.controller.js'
import AuthService from '#services/auth.service.js'
import authValidation from '#validations/auth.validation.js'

const router = express.Router()
const authService = new AuthService()
const authController = new AuthController(authService)
const { loginValidation, createUserValidation } = authValidation

//  API routes
router.post('/guest-login', authController.guestLogin)
router.post('/login', loginValidation, authController.login)
router.post('/create-user', createUserValidation, authController.createUser)
router.post('/logout', authController.logout)

export default router