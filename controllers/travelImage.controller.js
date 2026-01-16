import { StatusCodes as Status } from 'http-status-codes'
import asyncHandler from 'express-async-handler'
import ApiResponse from '#utils/apiResponse.js'
import AppError from '#utils/appError.js'

class TravelImagesController {
  constructor(TravelImageService) {
    this.TravelImageService = TravelImageService
  }

  getAllTravelImages = asyncHandler(async (req, res) => {
    const { source } = req.query
    let travelImages = []

    if (source === 'cloudinary') {
      travelImages = await this.TravelImageService.fetchTravelImagesFromCloudinary()
    } else {
      travelImages = await this.TravelImageService.getAll()
    }

    res.json(ApiResponse.successResponse("Travel images retrieved successfully", travelImages))
  })

  addTravelImage = asyncHandler(async (req, res) => {
    const response = await this.TravelImageService.uploadTravelImage(req.file.path)
    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Image added successfully", response))
  })

  editTravelImage = asyncHandler(async (req, res) => {
    const updatedTravelImage = await this.TravelImageService.updateTravelImage(req.params.id, req.body)
    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Image updated successfully", updatedTravelImage))
  })

  deleteTravelImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { target } = req.query

    if (!id) throw new AppError("No publicId provided", 400)

    if (target === 'cloudinary') {
      await this.TravelImageService.removeFromCloudinary(id)
    } else {
      await this.TravelImageService.removeTravelImage(req.body.publicId, id)
    }

    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Image deleted successfully"))
  })

  renderAddTravelImage = asyncHandler(async (req, res) => {
    res.render('travelImages/addTravelImage', {
      title: 'Travel Images',
      user: req.user
    })
    
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  })

  renderEditTravelImage = asyncHandler(async (req, res) => {
    const travelImage = await this.TravelImageService.getById(req.params.id)
    const travelImages = await this.TravelImageService.getAll()
      
    const currentIndex = travelImages.findIndex(
      img => img._id.toString() === travelImage._id.toString()
    )

    res.render('travelImages/editTravelImage', {
      prevImage: currentIndex > 0 ? travelImages[currentIndex - 1] : null,
      nextImage: currentIndex < travelImages.length - 1 ? travelImages[currentIndex + 1] : null,
      travelImage,
      title: 'Travel Images',
    })
  })

  syncCloudinaryToMongo = asyncHandler(async (req, res) => {
    const reuslts = await this.TravelImageService.syncCloudinaryImagesToMongo()
    res.json(ApiResponse.successResponse("Travel images synced successfully", reuslts))
  })

  reorderTravelImages = asyncHandler(async (req, res) => {
    await this.TravelImageService.reorderTravelImages(req.body)
    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Images reordered sucessfully"))
  })
}

export default TravelImagesController