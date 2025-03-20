import asyncHandler from 'express-async-handler'
import { cache } from '../cache.js'
import AppError from '../utils/appError.js'

class TravelImagesController {
  constructor(cloudinaryService) {
    this.cloudinaryService = cloudinaryService
    this.getAllTravelImages = this.getAllTravelImages.bind(this)
    this.addTravelImage = this.addTravelImage.bind(this)
    this.deleteTravelImage = this.deleteTravelImage.bind(this)

    this.getAllTravelImages = asyncHandler(this.getAllTravelImages)
    this.addTravelImage = asyncHandler(this.addTravelImage)
    this.deleteTravelImage = asyncHandler(this.deleteTravelImage)
  }

  async getAllTravelImages(req, res) {
    const cachedImages = cache.get('travelImages')
    if (cachedImages) return res.json({ images: cachedImages, success: true })
  
    const webpImages = await this.cloudinaryService.fetchTravelImages()
    cache.set('travelImages', webpImages)
    res.json({ images: webpImages, success: true })
  }

  async addTravelImage(req, res) {
    const response = await this.cloudinaryService.uploadTravelImage(req.file.path)
    if (response.secure_url) {
      res.status(201).json({
        success: true,
        message: "Travel Image saved successfully",
      })
    }
  }

  async deleteTravelImage(req, res) {
    const { id } = req.params
    if (!id) throw new AppError("No publicId provided", 400)
  
    const response = await this.cloudinaryService.removeTravelImage(id)
    if (response.result === 'ok') {
      res.status(200).json({
        success: true,
        message: "Travel Image deleted successfully",
      })
    }
  }

  async renderAddTravelImage(req, res) {
    try {
      res.render('travelImages/addTravelImage', {
        title: 'Travel Images',
        user: req.user
      })
    } catch (err) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default TravelImagesController