import express from "express"
import { getAllTravelImages } from '../controllers/travelImagesController.js'

const router = express.Router()

router.get('/api', getAllTravelImages)
router.post('/upload-image', getAllTravelImages)
router.delete('/delete-image', getAllTravelImages)

export default router