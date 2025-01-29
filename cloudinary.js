import { v2 as cloudinary } from 'cloudinary'


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