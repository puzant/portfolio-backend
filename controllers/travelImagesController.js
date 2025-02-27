import { cache } from '../cache.js'
import { fetchTravelImages, removeTravelImage, uploadTravelImage } from '../cloudinary.js'

class TravelImagesController {
  constructor(logger) {
    this.logger = logger
    this.getAllTravelImages = this.getAllTravelImages.bind(this)
    this.addTravelImage = this.addTravelImage.bind(this)
    this.deleteTravelImage = this.deleteTravelImage.bind(this)
  }

  async getAllTravelImages(req, res) {
    try {
      const cachedImages = cache.get('travelImages')
      
      if (cachedImages) {
        return res.json({ images: cachedImages, success: true })
      }
  
      const webpImages = await fetchTravelImages()
      cache.set('travelImages', webpImages)
      res.json({ images: webpImages, success: true })
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch images from Cloudinary",
        error: err.message,
      });
    }
  }

  async addTravelImage(req, res) {
    try {
      const response = await uploadTravelImage(req.file.path)
      if (response.secure_url) {
        res.status(201).json({
          success: true,
          message: "Travel Image saved successfully",
        })
      }
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later."
      })
    }
  }

  async deleteTravelImage(req, res) {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ success: false, message: "No publicId provided" })
    }
  
    try {
      const response = await removeTravelImage(id)
      if (response.result === 'ok') {
        res.status(200).json({
          success: true,
          message: "Travel Image deleted successfully",
        })
      }
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later."
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