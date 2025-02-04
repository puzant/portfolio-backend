import express from 'express'
import { login, logout, createUser, renderLogin } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.get('/login', renderLogin)
router.post('/logout', logout)
router.post('/create-user', createUser)

export default router