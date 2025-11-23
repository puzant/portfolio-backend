import express from "express"

import TravelImagesController from '#controllers/travelImages.controller.js'
import authMiddleware from '#middlewares/auth.middleware.js'
import upload from "#middlewares/multerUpload.middleware.js"
import TravelImageService from '#services/travelImage.service.js'

const router = express.Router()
const travelImagesController = new TravelImagesController(TravelImageService)

router.get('/', travelImagesController.getAllTravelImages)
router.get('/add', authMiddleware, travelImagesController.renderAddTravelImage)
router.post('/add', authMiddleware, upload.single('travelImage'), travelImagesController.addTravelImage)
router.post('/sync', authMiddleware, travelImagesController.syncCloudinaryToMongo)
router.delete('/remove/:id', authMiddleware, travelImagesController.deleteTravelImage)

export default router