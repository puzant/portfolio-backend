import express from "express"

import { getAllTravelImages } from '../controllers/travelImagesController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/api', getAllTravelImages)
router.post('/upload-image', authMiddleware, getAllTravelImages)
router.delete('/delete-image', authMiddleware, getAllTravelImages)

export default router