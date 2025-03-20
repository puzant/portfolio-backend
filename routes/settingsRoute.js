import express from "express"
import SettingsController from "../controllers/settingsController.js"
import authMiddleware from '../middlewares/authMiddleware.js'
import SettingsService from "../services/settingsService.js"

const router = express.Router()
const settingsService = new SettingsService()
const settingsController = new SettingsController(settingsService)

router.post('/update-user', authMiddleware, settingsController.updateUserInfo)
router.post('/update-password', authMiddleware, settingsController.updatePassword)
router.post('/delete-account', authMiddleware, settingsController.deleteUserAccount)
router.get('/', authMiddleware, settingsController.renderSettings)

export default router