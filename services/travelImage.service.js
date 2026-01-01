import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes as Status, StatusCodes } from 'http-status-codes'
import TravelImage from '#models/travelImage.model.js'
import AppError from '#utils/appError.js'

class TravelImageService {
  async getAll() {
    return await TravelImage.find().sort({ order: 1 })
  }

  async getById(id) {
    const travelImage = await TravelImage.findById(id)
    if (!travelImage) {
      throw new AppError("Travel image was not found", Status.NOT_FOUND)
    }

    return travelImage
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
    const totalDocuments = await this.getAll()

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'travels',
    })
    
    if (!result.secure_url) {
      throw new AppError('Cloudinary upload failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const imageDoc = new TravelImage({
      url: result.url,
      display_name: result.display_name,
      asset_id: result.asset_id,
      public_id: result.public_id,
      order: totalDocuments.length + 1
    })
    
    imageDoc.save()
    return imageDoc
  }

  async updateTravelImage(id, updates) {
    const travelImage = await TravelImage.findById(id)
    if (!travelImage) 
      throw new AppError("Travel image not found", StatusCodes.NOT_FOUND)

    Object.assign(travelImage, updates)
    await travelImage.save()

    return travelImage
  }

  async removeTravelImage(publicId, id) {
    const travelImageToDelete = await TravelImage.findById(id)
    if (!travelImageToDelete) throw new AppError("Travel Image not found", Status.NOT_FOUND)

    await cloudinary.uploader.destroy('travels/' + publicId)
    await TravelImage.findByIdAndDelete(id)
  }

  async removeFromCloudinary(publicId) {
    await cloudinary.uploader.destroy('travels/' + publicId)
  }

  async syncCloudinaryImagesToMongo() {
   const images = await this.fetchTravelImagesFromCloudinary()
   const addedImages = []
   let order = 1

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

  async reOrderTravelImages(order) {
    const bulkOps = order.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { order: index } }
    }))
    
    const res = await TravelImage.bulkWrite(bulkOps)
    return res
  }
}

export default TravelImageService