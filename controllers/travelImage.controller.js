import { StatusCodes as Status } from 'http-status-codes'
import asyncHandler from 'express-async-handler'
import { cache } from '../cache.js'
import ApiResponse from '#utils/apiResponse.js'
import AppError from '#utils/appError.js'

class TravelImagesController {
  constructor(TravelImageService) {
    this.TravelImageService = TravelImageService
    this.getAllTravelImages = asyncHandler(this.getAllTravelImages.bind(this))
    this.addTravelImage = asyncHandler(this.addTravelImage.bind(this))
    this.editTravelImage = asyncHandler(this.editTravelImage.bind(this))
    this.deleteTravelImage = asyncHandler(this.deleteTravelImage.bind(this))
    this.syncCloudinaryToMongo = asyncHandler(this.syncCloudinaryToMongo.bind(this))
    this.reorderTravelImages = asyncHandler(this.reorderTravelImages.bind(this))

    this.renderAddTravelImage = asyncHandler(this.renderAddTravelImage.bind(this))
    this.renderEditTravelImage = asyncHandler(this.renderEditTravelImage.bind(this))
  }

  async getAllTravelImages(req, res) {
    const { source } = req.query
    let travelImages = []

    if (source === 'cloudinary') {
      travelImages = await this.TravelImageService.fetchTravelImagesFromCloudinary()
    } else {
      travelImages = await this.TravelImageService.getAll()
    }

    res.json(ApiResponse.successResponse("Travel images retrieved successfully", travelImages))
  }

  async addTravelImage(req, res) {
    const response = await this.TravelImageService.uploadTravelImage(req.file.path)
    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Image added successfully", response))
  }

  async editTravelImage(req, res) {
    const updatedTravelImage = await this.TravelImageService.updateTravelImage(req.params.id, req.body)
    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Image updated successfully", updatedTravelImage))
  }

  async deleteTravelImage(req, res) {
    const { id } = req.params
    const { target } = req.query

    if (!id) throw new AppError("No publicId provided", 400)

    if (target === 'cloudinary') {
      await this.TravelImageService.removeFromCloudinary(id)
    } else {
      await this.TravelImageService.removeTravelImage(req.body.publicId, id)
    }

    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Image deleted successfully"))
  }

  async renderAddTravelImage(req, res) {
    res.render('travelImages/addTravelImage', {
      title: 'Travel Images',
      user: req.user
    })
    
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }

  async renderEditTravelImage(req, res) {
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
  }

  async syncCloudinaryToMongo(req, res) {
    const reuslts = await this.TravelImageService.syncCloudinaryImagesToMongo()
    res.json(ApiResponse.successResponse("Travel images synced successfully", reuslts))
  }

  async reorderTravelImages(req, res) {
    await this.TravelImageService.reorderTravelImages(req.body)
    return res.status(Status.OK).json(ApiResponse.successResponse("Travel Images reordered sucessfully"))
  }
}

export default TravelImagesController