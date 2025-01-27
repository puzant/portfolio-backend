import { v2 as cloudinary } from 'cloudinary'

export const deleteImageFromCloudinary = async (publicId) => {
  cloudinary.uploader.destroy(publicId, (res) => {
    console.log("🚀 ~ cloudinary.uploader.destroy ~ res:", res)
  })
}

export const fetchProjectsImages = async () => {
  try {
    const results = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'projects',
      max_results: 50
    })

    return results
  } catch (err) {
    throw new Error(`Cloudinary fetch failed: ${err.message}`);
  }
}

export const fetchTravelImages = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'travels',
      max_results: 50
    })

    const webpImages = result.resources.map(resource => ({
      url: cloudinary.url(resource.public_id, {
        transformation: [
          { width: 384, height: 288, crop: 'fill', format: 'webp', quality: 'auto' }
        ],
      }),
      display_name: resource.display_name,
      asset_id: resource.asset_id,
      public_id: resource.public_id
    }))

    return webpImages
    
  } catch (err) {
    throw new Error(`Cloudinary fetch failed: ${err.message}`);
  }
}