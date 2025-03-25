import express from "express"

import TravelImagesController from '#controllers/travelImages.controller.js'
import authMiddleware from '#middlewares/authMiddleware.js'
import upload from "#middlewares/multerUpload.js"
import cloudinaryService from '../cloudinary.js'

const router = express.Router()
const travelImagesController = new TravelImagesController(cloudinaryService)

router.get('/', travelImagesController.getAllTravelImages)
router.post('/add', authMiddleware, upload.single('travelImage'), travelImagesController.addTravelImage)
router.delete('/remove/:id', authMiddleware, travelImagesController.deleteTravelImage)
router.get('/add', authMiddleware, travelImagesController.renderAddTravelImage)

export default router