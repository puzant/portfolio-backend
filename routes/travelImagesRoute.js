import express from "express"
import { getAllTravelImages } from '../controllers/travelImagesController.js'

const router = express.Router()

router.get('/api', getAllTravelImages)

export default router