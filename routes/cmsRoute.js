import express from 'express'
import CmsController from '../controllers/cmsController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/cms', authMiddleware, CmsController)

export default router