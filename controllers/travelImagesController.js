import { cache } from '../cache.js'
import { fetchTravelImages } from '../cloudinary.js'

export const getAllTravelImages = async (req, res) => {
  try {
    const cachedImages = cache.get('travelImages')
    
    if (cachedImages) {
      return res.json({ images: cachedImages, success: true })
    }

    const webpImages = await fetchTravelImages()

    cache.set('travelImages', webpImages)
    res.json({ images: webpImages, success: true })
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch images from Cloudinary",
      error: err.message,
    });
  }
}

export const addTravelImage = async (req, res) => {

}

export const deleteTravelImage = async (req, res) => {
  
}