import AppError from '#utils/appError.js'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes as Status } from 'http-status-codes'

class CloudinaryService {
  async fetchTravelImages() {
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
}


export default new CloudinaryService()