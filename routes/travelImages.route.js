import express from "express"
import authMiddleware from '#middlewares/auth.middleware.js'
import upload from "#middlewares/multerUpload.middleware.js"
import restrictTo from "#middlewares/role.middleware.js"
import TravelImageService from '#services/travelImage.service.js'
import TravelImagesController from '#controllers/travelImage.controller.js'

const router = express.Router()
const travelImageService = new TravelImageService()
const travelImagesController = new TravelImagesController(travelImageService)

router.get('/', travelImagesController.getAllTravelImages)
router.post('/add', authMiddleware, restrictTo('admin'), upload.single('travelImage'), travelImagesController.addTravelImage)
router.post('/sync', authMiddleware, restrictTo('admin'), travelImagesController.syncCloudinaryToMongo)
router.patch('/edit/:id', authMiddleware, restrictTo('admin'), travelImagesController.editTravelImage)
router.patch('/reorder', authMiddleware, restrictTo('admin'), travelImagesController.reorderTravelImages)
router.delete('/remove/:id', authMiddleware, restrictTo('admin'), travelImagesController.deleteTravelImage)

export default router