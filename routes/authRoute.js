import express from 'express'
import { login, logout, createUser, renderLogin } from '../controllers/authController.js'

const router = express.Router()

//  API routes
router.post('/login', login)
router.post('/logout', logout)
router.post('/create-user', createUser)

// rendering routes
router.get('/login', renderLogin)

export default router