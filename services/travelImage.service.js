import AppError from '#utils/appError.js'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes as Status } from 'http-status-codes'
import TravelImage from '#models/travelImage.model.js'

class TravelImageService {
  async getAll() {
    return TravelImage.find()
  }

  async fetchTravelImagesFromCloudinary() {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'travels',
        max_results: 50
      })

      const webpImages = result.resources.map(resource => ({
        url: cloudinary.url(resource.public_id, {
          transformation: [
            { width: 384, crop: 'fill', format: 'webp', quality: 'auto' }
          ],
        }),
        display_name: resource.display_name,
        asset_id: resource.asset_id,
        public_id: resource.public_id
      }))

      return webpImages
    } catch (error) {
      throw new AppError(err.message, Status.INTERNAL_SERVER_ERROR)
    }
  }

  async uploadTravelImage(filePath) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'travels',
    })
    return result
  }

  async removeTravelImage(publicId) {
    const result = await cloudinary.uploader.destroy('travels/' + publicId)
    return result
  }

  async syncCloudinaryImagesToMongo() {
   const images = await this.fetchTravelImages()
   const addedImages = []
   let order = 0

   for (const image of images) {
    const exists = await TravelImage.findOne({ public_id: image.public_id })

    if (!exists) {
      const imageDoc = new TravelImage({
        url: image.url,
        display_name: image.display_name,
        asset_id: image.asset_id,
        public_id: image.public_id,
        order: order++
      })
      
      await imageDoc.save()
      addedImages.push(imageDoc)
    }
   }

   return { addedCount: addedImages.length }
  }
}

export default new TravelImageService()