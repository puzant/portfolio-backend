import express from "express"
import { updateUserInfo, updatePassword, deleteUserAccount, renderSettings } from "../controllers/settingsController.js"
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/update-user', authMiddleware, updateUserInfo)
router.post('/update-password', authMiddleware, updatePassword)
router.post('/delete-account', authMiddleware, deleteUserAccount)
router.get('/', authMiddleware, renderSettings)

export default router