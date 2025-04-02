import express from 'express'
import CmsController from '#controllers/cms.controller.js'
import authMiddleware from '#middlewares/auth.middleware.js'

const router = express.Router()

router.get('/cms', authMiddleware, CmsController)

export default router