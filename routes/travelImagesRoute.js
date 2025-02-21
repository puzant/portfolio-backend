import express from "express"

import { getAllTravelImages, addTravelImage, deleteTravelImage, renderAddTravelImage } from '../controllers/travelImagesController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/api', getAllTravelImages)
router.post('/api/upload-image', authMiddleware, addTravelImage)
router.delete('/api/delete-image', authMiddleware, deleteTravelImage)
router.get('/add', authMiddleware, renderAddTravelImage)

export default router