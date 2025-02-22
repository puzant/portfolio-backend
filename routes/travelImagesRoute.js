import express from "express"

import { getAllTravelImages, addTravelImage, deleteTravelImage, renderAddTravelImage } from '../controllers/travelImagesController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import upload from "../middlewares/multerUpload.js"

const router = express.Router()

router.get('/api', getAllTravelImages)
router.post('/api/add', authMiddleware, upload.single('travelImage'), addTravelImage)
router.delete('/api/remove', authMiddleware, deleteTravelImage)
router.get('/add', authMiddleware, renderAddTravelImage)

export default router