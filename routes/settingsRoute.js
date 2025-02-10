import express from "express"
import { updateUserInfo, updatePassword, renderSettings } from "../controllers/settingsController.js"
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/update-user', authMiddleware, updateUserInfo)
router.post('/update-password', authMiddleware, updatePassword)
router.get('/', authMiddleware, renderSettings)

export default router