import express from "express"

import TravelImagesController from '../controllers/travelImagesController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import upload from "../middlewares/multerUpload.js"
import logger from '../logger.js'

const router = express.Router()
const travelImagesController = new TravelImagesController(logger)

router.get('/api', travelImagesController.getAllTravelImages)
router.post('/api/add', authMiddleware, upload.single('travelImage'), travelImagesController.addTravelImage)
router.delete('/api/remove/:id', authMiddleware, travelImagesController.deleteTravelImage)
router.get('/add', authMiddleware, travelImagesController.renderAddTravelImage)

export default router